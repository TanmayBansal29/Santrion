// Importing required packages
const mongoose = require("mongoose")

// Schema for medical profile of user
const medicalProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    allergies: [{
        allergen: String,
        reaction: String,
        severity: { type: String, enum: ["mild", "moderate", "severe"] }
    }],
    chronicConditions: [{
        condition: String,
        diagnosedAt: Date,
        notes: String
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    surgeries: [{
        name: String,
        date: Date,
        hospital: String,
        notes: String
    }],
    familyHistory: {
        condition: String,
        relation: String
    },
    height: {
        type: Number,
        max: 300,
        min: 30
    },
    weight: {
        type: Number,
        min: 1,
        max: 500
    },
    bmi: {
        type: Number,
        min: 10,
        max: 60
    },
    bloodPressure: {
        systolic: {
            type: Number,
            min: 50,
            max: 250
        },
        diastolic: {
            type: Number,
            min: 30,
            max: 150
        }
    },
    primaryDoctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    }
}, {timestamps: true})

const MedicalProfile = mongoose.model("MedicalProfile", medicalProfileSchema)
module.exports = MedicalProfile

