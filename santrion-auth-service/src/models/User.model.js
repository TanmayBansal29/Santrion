// Importing required packages
const mongoose  = require("mongoose")

const userSchema = mongoose.Schema({
    // ------------- Core Identity -------------
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    middleName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    // ------------- Profile Info -------------
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
        default: "Other"
    },
    dateOfBirth: {
        type: Date,
        required: true
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
            trim: true
        },
        stateName: {
            type: String,
            required: true,
            trim: true
        },
        countryName: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: String,
            required: true,
            trim: true
        }
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    // ------------- Role and Domain -------------
    role: {
        type: String,
        required: true,
        enum: ['Patient',
        'Doctor',
        'Pathologist',
        'Pharmacist',
        'Nurse',
        'Admin',
        'Fitness Trainer',
        'Dietician',
        'Nutritionist']
    },
    domain: {
        type: String,
        required: true,
        enum: ['HealthCare', 'Fitness']
    },
    // ------------- Verification & Security -------------
    resetToken: {
        type: String
    },
    resetDate: {
        type: Date
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lastLoginAt: {
        type: Date
    },
    accountLocked: {
        type: Boolean,
        default: false
    },
    isTermsandConditionsAccepted: {
        type: Boolean,
        required: true
    },
    isPrivacyPolicyAccepted: {
        type: Boolean,
        required: true
    }
},
{timestamps: true})

const UserProfile = mongoose.model("User", userSchema)
module.exports = UserProfile