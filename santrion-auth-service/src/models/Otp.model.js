// Importing required modules
const mongoose = require("mongoose")

// Schema for OTP logs
const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    purpose: {
        type: String,
        enum: ["registration", "login", "password_reset", "email_update"],
        required: true
    },
    channel: {
        type: String,
        enum: ["email", "sms", "whatsapp", "push"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {expires: 0}
    },
    verifiedAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    attemptCount: {
        type: Number,
        default: 0
    },
    resendCount: {
        type: Number,
        default: 0
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "verified", "failed", "expired"],
        default: "pending"
    }
})

// Compound index for efficient OTP verification checks
otpSchema.index({email:1, purpose:1, createdAt:-1})

module.exports = mongoose.model("Otp", otpSchema)