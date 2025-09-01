// Importing required packages
const mongoose = require("mongoose")

const resetTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    location: {
        type: String
    },
    requestSource: {
        type: String,
        enum: ["web", "mobile", "admin"],
        default: "web"
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    usedAt: {
        type: Date,
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date
    },
    revokedBy: {
        type: String,
        enum: ["System", "Admin", "User"]
    },
    sessionId: {
        type: String
    },
    attemptCount: {
        type: Number,
        default: 0
    },
    lastAttemptAt: {
        type: Date
    }
}, {timestamps: true})

// TTL index for auto-cleanup of expired tokens
resetTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})

const ResetToken = mongoose.model("ResetToken", resetTokenSchema)
module.exports = ResetToken