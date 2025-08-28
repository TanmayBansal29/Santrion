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
