const UserProfile = require("../models/User.model")
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
        const domain = roleDomainMap[role.charAt(0).toUpperCase() + role.slice(1)]
        if(!domain) {
            return res.status(400).json({
                success: false,
                message: "Invalid Role Domain Mapping"
            })
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

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later"
        })
    }
}