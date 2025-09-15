// Importing required packages
const mongoose = require("mongoose")

// Creating schema for storing documents
const DocumentsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["prescription", "lab_report", "insurance", "id_proof", "medical_history", "other"],
        default: "other"
    },
    url: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
    },
    fileFormat: {
        type: String 
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})