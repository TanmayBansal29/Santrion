// Importing required packages
const mongoose = require("mongoose")

// Schema for extended user
const userProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                const today = new Date()
                return value < today // must be in past
            },
            message: "Date of Birth must be in past"
        }
    },
    profileImageUrl: {
        type: String,
        default: ""
    },
    profileImagePublicId: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        maxlength: 250,
        trim: true
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
        name: {
            type: String,
            trim: true,
            maxlength: 50
        },
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[0-9]{7,15}$/.test(v); // basic phone validation
                },
                message: props => `${props.value} is not a valid phone number`
            }
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})


const UserProfileExtended = mongoose.model("UserProfile", userProfileSchema)
module.exports = UserProfileExtended

