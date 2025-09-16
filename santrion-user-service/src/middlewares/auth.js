// Importing required packages
const jwt = require("jsonwebtoken")
require("dotenv").config()
/**
 * Auth Middleware
 * - Verifies JWT access token
 * - Attaches decoded user info to req.user
 * - Handles errors gracefully
 */

export const authenticate = (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers["authorization"]
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Authorization token missing or malformed"
            })
        }
        // Extract Token
        const token = authHeader.split(" ")[1]

        // Verify token (secret or public key from env)
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        // Attach decoded payload to req.user
        req.user = {
            id: decoded.sub || decoded.userId,
            role: decoded.role,
            email: decoded.email
        }

        // Pass Control
        next();
    } catch (error) {
        console.error("Auth middleware error: ", err)
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({
                message: "Token Expired. Please login again"
            })
        }
        return res.status(401).json({
            message: "Invalid token. Access Denied"
        })
    }
}

/**
 * Role-based authorization middleware
 * Usage: app.get('/admin', authenticate, authorize(['admin']), ...)
 */

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(403).json({
                success: false,
                message: "User not authenticated"
            })
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "User not authorized to perform this action"
            })
        }
        next();
    }
}