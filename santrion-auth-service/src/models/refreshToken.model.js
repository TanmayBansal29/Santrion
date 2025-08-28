// Importing required modules
const mongoose = require("mongoose")

// Creating the Schema for refresh token
const refreshTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        enum: ["mobile", "computer", "tablet", "other"],
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    sessionId: {
        type: String
    },
    replacedByToken: {
        type: String
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date
    },
    createByIp: {
        type: String
    },
    lastUsedAt: {
        type: Date
    },
    refreshCount: {
        type: Number,
        default: 0
    },
    location: {
        type: String
    },
    deviceName: {
        type: String
    },
    fingerprint: {
        ype: String
    }
},
{timestamps: true})

// TTL (Time to Live) Index
refreshTokenSchema.index({expiresAt: 1}, {expiresAfterSeconds: 0})

// Compound unique index
refreshTokenSchema.index({userId: 1, deviceType: 1, sessionId: 1}, {unique: true})

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)
module.exports = RefreshToken