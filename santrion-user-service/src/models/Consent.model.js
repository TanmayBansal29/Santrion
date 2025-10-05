// Importing required packages
const mongoose = require("mongoose")

// Centralized Consent types for maintainability
const CONSENT_TYPES = [
    "data_sharing_with_doctors",
    "research_data_usage",
    "marketing_communications",
    "third_party_integrations"
]

// Schema for consent of user
const consentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    consentType: {
        type: String,
        enum: CONSENT_TYPES,
        required: true,
        index: true
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
        trim: true,
        maxlength: 250
    },
    givenAt: {
        type: Date
    },
    revokedAt: {
        type: Date
    },
    version: {
        type: Number,
        default: 1
    },
    ipAddress: {
        type: String
    },
    deviceInfo: {
        type: String
    }
}, {timestamps: true})

// Pre save hook - automatically handle dates and versioning
consentSchema.pre("save", async function (next) {
    if(this.isNew){
        if(this.status === "granted" && !this.givenAt){
            this.givenAt = new Date()
        }
        if(this.status === "revoked" && !this.revokedAt){
            this.revokedAt = new Date()
        }
    }

    // Increment version for this userId + consentType
    const latest  =await mongoose.model("Consent").findOne({
        userId: this.userId,
        consentType: this.consentType
    }).sort({createdAt: -1})

    if(latest){
        this.version = latest.version + 1
    }

    next();
})

// Optimize Queries
consentSchema.index({userId: 1, consentType: 1, createdAt: -1})

const Consent = mongoose.model("Consent", consentSchema)
module.exports = {Consent, CONSENT_TYPES}