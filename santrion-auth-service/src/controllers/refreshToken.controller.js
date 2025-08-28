// Importing important packages
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/refreshToken.model")
const UserProfile = require("../models/User.model")

/**
 * Helper: Generate refresh token (raw + hashed)
 */

exports.generateRefreshToken = async(user, req) => {
    const rawToken = crypto.randomBytes(64).toString("hex")
    const hashedToken = await bcrypt.hash(rawToken, 10)

    const refreshTokenDoc = await RefreshToken.create({
        userId: user._id,
        token: hashedToken,
        deviceType: req.body.deviceType || "other",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
        sessionId: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    return { rawToken, refreshTokenDoc }
}

/**
 * Refresh Access token
 */

exports.refreshAccessToken = async (req, res) => {
    try {
        // Getting the refresh token from req body
        const { refreshToken: incomingToken } = req.body
        if(!incomingToken){
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            })
        }

        // Finding the refresh tokens
        const refreshTokens = await RefreshToken.find({
            isRevoked: false,
            expiresAt: {$get: new Date()}
        })
        let validTokenDoc = null

        // Looping around all refreshTokens to find a match
        for (let tokenDoc of refreshTokens){
            const isMatch = await bcrypt.compare(incomingToken, tokenDoc.token)
            if(isMatch){
                validTokenDoc = tokenDoc
                break
            }
        }

        if(!validTokenDoc){
            return res.status(403).json({
                success: false,
                message: "Invalid or expired refresh token"
            })
        }

        // Get User
        const user = await UserProfile.findById(validTokenDoc.userId)
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Rotate Refresh Token
        validTokenDoc.isRevoked = true;
        validTokenDoc.replacedByToken = incomingToken
        await validTokenDoc.save()

        const { rawToken: newRawToken, refreshTokenDoc: newRefreshToken } = await this.generateRefreshToken(user, req)
        // Generate new access token
        const accessToken = jwt.sign(
            { username: user.username, id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        )

        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRawToken,
            sessionId: newRefreshToken.sessionId
        })
    } catch (error) {
        console.error("Error refresh token: ", error)
        return res.status(500).json({
            success: false,
            message: "Could not refresh token"
        })
    }
}

/**
 * Logout Controller
 */
exports.logout = async (req, res) => {
    try {
        // Looking for the refreshToken
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
        if(!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required to logout"
            })
        }

        if(refreshToken){
            // Hash the incoming token for DB lookup (to match stored hash)
            const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")

            // Mark this refresh token as revoked
            await RefreshToken.findOneAndUpdate(
            {tokenHash: hashedToken, userId: req.user.id, isRevoked: false},
            { isRevoked: true, revokedAt: new Date(), revokedByIp: req.ip },
            { new: true}
            )
        }

        // clear cookies
        res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" })
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" })

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("Error during logout: ", error)
        return res.status(500).json({
            success: false,
            message: "Logout failed. Please try again"
        })
    }
}

/**
 * Logout Controller: from all devices
 */

exports.logoutAllDevices = async (req, res) => {
    try {
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success: false,
                message: "Unauthorized Request"
            })
        }

        // Revoke all active refresh tokens for this user
        await RefreshToken.updateMany(
            {userId: req.user.id, isRevoked: false},
            {isRevoked: true, revokedAt: new Date(), revokedByIp: req.ip}
        )

        // Clear cookies for current device
        res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });

        return res.status(200).json({
            success: true,
            message: "Logged out from all devices successfully"
        })
    } catch (error) {
        console.error("Error during Logging out from all devices: ", error)
        return res.status(500).json({
            success: false,
            message: "Logout from all devices failed. Please try again"
        });
    }
}

/**
 * Get all active sessions for the logged-in user
 */

exports.getAllSessions = async (req, res) => {
    try {
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success: false,
                message: "unauthorized Access"
            })
        }

        // Find all active sessions
        const sessions = await RefreshToken.find({
            userId: req.user.id,
            isRevoked: false,
            expiresAt: {$gt: new Date()}
        }).select("-tokenHash -__v") // don’t return token hash for security

        return res.status(200).json({
            success: true,
            count: sessions.length,
            sessions
        })
    } catch (error) {
        console.error("Error while fetching all sessions IDs: ", error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch active sessions"
        })
    }
}

/**
 * Logout from a specific device (by SessionId)
 */

exports.logoutSpecificDevice = async (req, res) => {
    try {
        const {sessionId} = req.body
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success: false,
                message: "unauthorized Access"
            })
        }

        if(!sessionId){
            return res.status(400).json({
                success: false,
                message: "sessionId is required"
            })
        }

        // Find the session and mark as resolved
        const session = await RefreshToken.findOneAndUpdate(
            {userId: req.user.id, sessionId, isRevoked: false},
            {isRevoked: true, revokedAt: new Date(), revokedByIp: req.ip},
            {new: true}
        )

        if(!session){
            return res.status(404).json({
                success: false,
                message: "Session not found or already revoked"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Device Logged out successfully",
            sessionId
        })
    } catch (error) {
        console.log("Error logging out specific device: ", error)
        return res.status(500).json({
            success: false,
            message: "Failed to logout from the device"
        })
    }
}