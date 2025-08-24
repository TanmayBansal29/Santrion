// Importing required packages
const express = require("express")
const { sendOTP, verifyOTP } = require("../controllers/otp.controller")
const router = express.Router()

// OTP - Registration Routes
router.post("/send-otp/:purpose", sendOTP)

router.post("/verify-email/:purpose", verifyOTP)

module.exports = router