const {registerValidationSchema} = require("../validations/registeration.validation")

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
            firstName, lastName, 
        } = value
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later"
        })
    }
}