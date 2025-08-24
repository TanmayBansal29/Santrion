// Importing required modules
const mongoose = require("mongoose")
const mailer = require("../utils/mailer.utils")
const otpVerification = require("../mails/otpVerification.mail")

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

// Defining a function to send the emails
async function sendVerificationEmail(emailAddress, otp) {
    try{
        const mailResponse = await mailer(
            emailAddress,
            "Verification Mail",
            otpVerification(otp)
        )
        console.log("Mail Response: ", mailResponse.response)
    } catch (error) {
        console.log("Error occurred while sending mail: ", error)
        throw error
    }
}

// Defining a post save hook to send email after the document has been saved
otpSchema.post("save", async function (doc, next) {
    console.log("New Document is saved to DB")
    if(doc.isNew) {
        try {
            await sendVerificationEmail(doc.emailAddress, doc.otp)
        } catch (error) {
            console.log("Sending Verification Mail Failed: ", error)
        }
    }
})

const OtpModel = mongoose.model("Otp", otpSchema)
module.exports = OtpModel