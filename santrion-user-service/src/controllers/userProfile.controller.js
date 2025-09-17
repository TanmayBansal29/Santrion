const userProfileService = require("../services/userProfileService")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")

// Create User Profile
exports.createUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id // from auth middleware
        const profileData = req.body

        const profile = await userProfileService.createProfile(userId, profileData)
        return res.status(201).json(
            new ApiResponse(201, profile, "User Profile Created Successfully")
        )
    } catch (error) {
        next(error)
    }
}

// Get own user profile
exports.getMyProfile = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const profile = await userProfileService.getProfileByUserId(userId)
        if(!profile) {
            throw new ApiError(404, "Profile not found")
        }
    } catch (error) {
        next(error)
    }
}