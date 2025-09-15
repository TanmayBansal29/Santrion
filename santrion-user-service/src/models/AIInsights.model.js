// Importing required packages
const mongoose = require("mongoose")

// schema for storing AI generated Insights
const AIInsightsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    aiHealthSummary: {
        type: String,
        trim: true
    },
    aiRecommendations: [{
        type: String,
        trim: true
    }],
    aiRiskScore: {
        type: Number,
        min: 0,
        max: 100
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 1
    },
    modelUsed: {
        type: String,
        trim: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    isReviewedByDoctor: {
        type: Boolean,
        default: false
    },
    sourceDataRef: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Documents" // or MedicalProfile/ActivityLog etc.
    }],
    aiFeedback: {
        feedback: {
            type: String,
            trim: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }
}, {timestamps: true})

const AIInsights = mongoose.model("AIInsights", AIInsightsSchema)
module.exports = AIInsights