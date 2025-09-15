// Importing required packages
const mongoose = require("mongoose")

// Schema for activity log
const ActivityLogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: [
            "login",
            "logout",
            "failed_login",
            "profile_update",
            "password_change",
            "consent_update",
            "appointment_booking",
            "data_export"
        ],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String
    },
    deviceInfo: {
        os: String,
        browser: String,
        deviceType: {
            type: String,
            enum: ["desktop", "mobile", "tablet", "other"] 
        }
    },
    location: {
        country: String,
        city: String
    },
    severity: {
        type: String,
        enum: ["info", "warning", "critical"],
        default: "info"
    }
}, {timestamps: true}
)

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema)
module.exports = ActivityLog