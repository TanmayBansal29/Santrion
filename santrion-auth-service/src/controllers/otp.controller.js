const OtpModel = require("../models/Otp.model");
const { sendOtp, verifyOtp } = require("../utils/otp.utils")

// Controller for Sending OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email, purpose, channel = "email" } = req.body

        if(!email || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email and purpose are required"
            })
        }

        // Generate + Save + Send
        const otp = await sendOtp({
            email,
            purpose,
            channel,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });

        return res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            data: { email }
        })
    } catch (error) {
        console.error("Error in sending OTP: ", error)
        return res.status(500).json({
            success: false,
            message: "Failed to Send OTP",
            error: error.message
        })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const {email, otp, purpose} = req.body
        if(!email || !otp || !purpose) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and purpose are required"
            })
        }

        // Verify OTP via Service
        const verified = await verifyOtp({email, otp, purpose})
        if(!verified){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            })
        }

        // Update Mongo Audit Trail
        await OtpModel.findOneAndUpdate(
            {email, purpose, status: "pending"},
            {
                $set: {
                    status: "verified",
                    isVerified: true,
                    verifiedAt: new Date()
                }
            },
            {sort: {createdAt: -1}}
        )

        return res.status(200).json({
            success: true,
            message: "OTP Verified Successfully"
        })
    } catch (error) {
        console.log("Error verifying OTP: ", error)
        return res.status(500).json({
            success: false,
            message: "Failed to Verify OTP",
            error: error.message
        })
    }
}

