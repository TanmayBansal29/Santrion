// Importing required modules
const UserProfile = require("../models/UserProfile.model")
const ApiError = require("../utils/ApiError")

// Create Profile
exports.createProfile = async (userId, profileData) => {
    const existingProfile = await UserProfile.findOne({userId})
    if(existingProfile){
        throw new ApiError(400, "Profile already exists")
    }

    const profile = new UserProfile({userId, ...profileData})
    return await profile.save()
}

// Get profile by userId
exports.getProfileByUserId = async (userId) => {
    return await UserProfile.findOne({userId}).populate("userId", "email username role")
}