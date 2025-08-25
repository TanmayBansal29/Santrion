const jwt = require("jsonwebtoken")

// auth middleware that verifies whether the jwt token is valid or not
exports.auth = async (req, res, next) => {
    try {
        // Extract the token
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")

        // Checking whether token is missing or not
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        // If token is in "Bearer <token>" format, strip "Bearer "
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim()
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            next()
        } catch (error) {
            console.error("JWT verification failed:", error.message)
            return res.status(401).json({
                success: false,
                message: "Something went wrong while validating the token"
            })
        }
    } catch (error) {
        // Catching the error
        console.error("Error validating the token: ", error)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}

