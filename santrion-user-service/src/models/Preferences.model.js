// Importing required packages
const mongoose = require("mongoose")

// Schema for user preferences
const preferencesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    language: {
        type: String,
        default: "en",   // English
        enum: ['en', 'hi', 'pa', 'te', 'kn', 'mr', 'ta', 'bn']
    },
    timeZone: {
        type: String,
        default: "Asia/Kolkata"
    },
    theme: {
        type: String,
        enum: ["Light", "Dark", "System"],
        default: "System"
    },
    notificationSettings: {
        emailSettings: {
            type: Boolean,
            default: true
        },
        smsSettings: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: true
        }
    },
    privacySettings: {
        shareProfileWithDoctors: {
            type: Boolean,
            default: false
        },
        shareDataForResearch: {
            type: Boolean,
            default: false
        },
        allowMarketingEmails: {
            type: Boolean,
            default: false
        }
    }
})

const Preferences = mongoose.model("Preferences", preferencesSchema)
module.exports = Preferences