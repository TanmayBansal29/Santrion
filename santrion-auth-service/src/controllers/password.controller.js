// Importing important packages
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const UserProfile = require("../models/User.model")
const ResetToken = require("../models/resetToken.model")
const RefreshToken = require("../models/refreshToken.model")

// Forgot password controller
exports.forgotPassword = async(req, res) => {
    try{
        // Getting email/username -> identifier from user
        const {identifier} = req.body

        // Checking if identifier missing
        if(!identifier){
            return res.status(400).json({
                success: false,
                message: "Email/Username Required"
            })
        }

        // Detect Identifier type
        const isEmail = /\S+@\S+\.\S+/.test(identifier)
        const user = isEmail
        ? await UserProfile.findOne({email: identifier.toLowercase().trim()})
        : await UserProfile.findOne({username: new RegExp(`^${identifier}$`, "i")})

        // Checking if user is there or not
        if(!user){
            // Not revealing User exists or not
            return res.status(200).json({
                success: true,
                message: "If the account exists, password reset instructions will be sent"
            })
        }

        // Check for too many requests (rate limiting)
        const recentToken = await ResetToken.findOne({
            userId: user._id,
            createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000)} // last 15 mins
        })

        if(recentToken){
            return res.status(429).json({
                success: false,
                message: "Password reset request already sent recently. Please wait"
            })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(64).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

        // Store in DB
        await ResetToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            location: req.headers["x-forwarded-for"] || "unknown",
            requestSource: "web"
        })

        // Sending email
        //
        //
        //

        return res.status(200).json({
            success: true,
            message: "If the account exists, password instructions will be sent"
        })

    } catch (error) {
        console.log("Forgot Password Error: ", error)
        return res.status(500).json|({
            success: false,
            message: "Something went wrong forgetting password"
        })
    }
}

// Reset Password Controller
exports.resetPassword = async (req, res) => {
    try{
        // Getting token and new password from user
        const {token, newPassword, confirmNewPassword} = req.body

        // Checking if all fields are entered or not
        if(!token || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please Enter all the fields"
            })
        }

        // Checking if password and confirm password are same or not
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password should be same"
            })
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

        // Find valid reset token
        const resetTokenDoc = await ResetToken.findOne({tokenHash})
        if(!resetTokenDoc || resetTokenDoc.expiresAt < Date.now() || resetTokenDoc.isUsed || resetTokenDoc.isRevoked){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            })
        }

        // update attempt count
        resetTokenDoc.attemptCount += 1
        resetTokenDoc.lastAttemptAt = new Date();

        if(resetTokenDoc.attemptCount > 5){
            resetTokenDoc.isRevoked = true
            resetTokenDoc.revokedAt = new Date()
            await resetTokenDoc.save()
            return res.status(403).json({
                success: false,
                message: "Too many attempts. Token revoked"
            })
        }

        // Update user password
        const user = await UserProfile.findById(resetTokenDoc.userId)
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        // Mark token as used
        resetTokenDoc.isUsed = true
        resetTokenDoc.usedAt = new Date()
        await resetTokenDoc.save()

        // Revoke all refresh tokens for this user (force logout everywhere)
        await RefreshToken.updateMany(
            {userId: user._id, isRevoked: false},
            {isRevoked: true, revokedAt: new Date(), revokedBy: "System"}
        )

        // Send Confirmation email
        //
        //
        //

        return res.status(200).json({
            success: true,
            message: "Password reset Successful"
        })
    } catch (error) {
        console.log("Error resetting password: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong resetting password"
        })
    }
}

// Update Password Controller (Requires Authentication)
exports.updatePassword = async (req, res) => {
    try {
        // getting the current password and new password from user
        const {currentPassword, newPassword} = req.body

        // Checking if all fields are entered
        if(!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Enforce Strong password policy
        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if(!passwordPolicy.test(newPassword)){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 chars, include uppercase, lowercase, number, and special character"
            })
        }

        const user = await UserProfile.findById(req.user.id)
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        // Check if new password is same as old
        const isSame = await bcrypt.compare(newPassword, user.password)
        if(isSame){
            return res.status(400).json({
                success: false,
                message: ""
            })
        }

        // Update user password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.lastPasswordChangeAt = new Date();
        await user.save()

        // Revoke all refresh tokens for this user (force logout everywhere)
        await RefreshToken.updateMany(
            {userId: user._id, isRevoked: false},
            {isRevoked: true, revokedAt: new Date(), revokedBy: "User"}
        )

        // Send email - notify
        //
        //
        //

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        })
        
    } catch (error) {
        console.log("Error Updating password: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong updating the password"
        })
    }
}