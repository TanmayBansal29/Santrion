// Importing required packages
const mongoose = require("mongoose")

// Schema for consent of user
const consentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    consentType: {
        type: String,
        enum: [
            "data_sharing_with_doctors",
            "research_data_usage",
            "marketing_communications",
            "third_party_integrations"
        ],
        required: true
    },
    status: {
        type: String,
        enum: ["granted", "revoked"],
        required: true
    },
    collectedBy: {
        type: String,
        enum: ["system", "admin", "user"],
        default: "user"
    },
    notes: {
        type: String,
        trim: true
    },
    givenAt: {
        type: Date
    },
    revokedAt: {
        type: Date
    }
}, {timestamps: true})

const Consent = mongoose.model("Consent", consentSchema)
module.exports = Consent