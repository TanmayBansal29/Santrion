// Importing required packages
const express = require("express")
const { sendOTP, verifyOTP } = require("../controllers/otp.controller")
const router = express.Router()

// OTP - Registration Routes
router.post("/send-otp/registration", (req, res) => {
    req.body.purpose = "registration"
    sendOTP(req, res)
})

router.post("verify-email/registration", (req, res) => {
    req.body.purpose = "registration"
    verifyOTP(req, res)
})

module.exports = router