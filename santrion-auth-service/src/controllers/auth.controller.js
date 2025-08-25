const OtpModel = require("../models/Otp.model")
const UserProfile = require("../models/User.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {registerValidationSchema, roleDomainMap} = require("../validations/registeration.validation")

// Signup controller
exports.signup = async (req, res) => {
    try {
        // Validating the request Body
        const {error, value} = registerValidationSchema.validate(req.body, {abortEarly: false})

        if(error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error.message
            })
        }

        // Extract validated values
        const {
            firstName, middleName, lastName, username, email, phone,
            password, role, dateOfBirth, gender, address, termsAccepted, privacyPolicyAccepted
        } = value

        // Role -> Domain Mapping
        const domain = roleDomainMap[role.toLowerCase()];
        if (!domain) {
            return res.status(400).json({
                success: false,
                message: "Invalid Role Domain Mapping"
            });
        }

        // Check for duplicate email/password
        const existingUser = await UserProfile.findOne({ $or: [{email}, {phone}, {username}]})
        if(existingUser) {
            if(existingUser.email === email) {
                return res.status(400).json({
                    success: false,
                    field: "email",
                    message: "User exists with this email"
                })
            } else if (existingUser.phone === phone) {
                return res.status(400).json({
                    success: false,
                    field: "phone",
                    message: "User exists with this phone"
                })
            } else if (existingUser.username === username) {
                return res.status(400).json({
                    success: false,
                    field: "username",
                    message: "Username already exists"
                });
            }
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Checking whether email is otp verified
        const latestOTP = await OtpModel.findOne({email, purpose: "registration"}).sort({createdAt: -1})
        if(!latestOTP || latestOTP.status !== "verified"){
            return res.status(400).json({
                success: false,
                message: "Please verify your email with OTP first"
            })
        }

        // verifying the accepted terms and privacy policy
        if(!termsAccepted || !privacyPolicyAccepted){
            return res.status(400).json({
                success: false,
                message: "You must accept Terms & Conditions and Privacy Policy"
            })
        }

        const user = await UserProfile.create({
            firstName,
            middleName,
            lastName,
            username,
            email,
            phone,
            password: hashedPassword,
            role,
            domain,
            dateOfBirth,
            gender,
            address,
            termsAccepted,
            privacyPolicyAccepted
        })

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                domain: user.domain
            }
        })

    } catch (error) {
        console.error("Error Registering User: ", error)
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later",
            error: error.message
        })
    }
}

// Login Controller
exports.login = async(req, res) => {
    try {
        // Get email/username --> identifier and password from req body
        const {identifier, password} = req.body

        // Checking if identifier or password is missing
        if(!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the required details"
            })
        }

        // Detect whether identifier is email or username
        const isEmail = /\S+@\S+\.\S+/.test(identifier)

        // Find the user with the provided username
        const user = isEmail
        ? await UserProfile.findOne({ email: identifier.toLowerCase().trim() })
        : await UserProfile.findOne({ username: new RegExp(`^${identifier}$`, "i") });

        // If user is not found in the database
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not registered. Please register to continue"
            })
        }

        // Check if account is locked
        if(user.isLocked && user.lockUntil > Date.now()) {
            return res.status(403).json({
                success: false,
                message: "Account locked due to multiple failed login attempts. Try again later"
            })
        }

        // Validate Password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        // Generate JWT Token and compare password
        if(!isPasswordValid) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            user.lastFailedLoginAt = new Date();

            // Lock account if too many failed attempts
            if (user.failedLoginAttempts >= 5){
                user.isLocked = true;
                user.lockUntil = Date.now() + 15 * 60 * 1000
            }

            await user.save();

            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            })
        }

        // Reset failed attempts
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = undefined;

        // Track login info
        user.lastLoginAt = new Date();
        user.lastLoginIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        user.loginCount = (user.loginCount || 0) + 1;

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            {username: user.username, id:user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "24h"}
        );

        // Set Cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        const {password: _, failedLoginAttempts, lockUntil, isLocked, ...safeUser} = user.toObject();
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            data: safeUser,
            message: "Login Successful"
        });

    } catch (error) {
        console.error("Error Occurred Login: ", error)
        return res.status(500).json({
            success: false,
            message: "Login Failure. Please try again"
        })
    }
}

// Logout Controller
exports.logout = async (req, res) => {
    // using clearCookie method to clear the cookie and log out
    res.clearCookie("token")
    return res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
}