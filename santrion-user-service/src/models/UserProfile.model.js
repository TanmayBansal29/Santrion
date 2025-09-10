// Importing required packages
const mongoose = require("mongoose")

// Schema for extended user
const userProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 250,
        trim: true,
        required: false
    },
    maritalStatus: {
        type: String,
        enum: ['Unmarried', 'Married']
    },
    address: {
        streetAddress: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        cityName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        stateName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        countryName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        pinCode: {
            type: String,
            required: true,
            trim: true,
            maxlength: 25
        }
    },
    emergencyContact: {
        type: String
    }
}, {timestamps: true})


const UserProfileExtended = mongoose.model("UserProfile", userProfileSchema)
module.exports = UserProfileExtended

