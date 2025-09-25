const ActivityLog = require("../models/ActivityLog.model")
const UserProfileExtended = require("../models/UserProfile.model")


// Create User Profile Controller
exports.createProfile = async (req, res) => {
    try {
        const userId = req.user.id  // Extracted from auth middleware
        const {gender, dateOfBirth, profileImageUrl, bio, maritalStatus, address, emergencyContact} = req.body

        // Validate required fields manually
        if(!gender || !dateOfBirth || !address) {
            return res.status(400).json({
                success: false,
                message: "Gender, Date of Birth, and address is required"
            })
        }
        
        // Checking if profile already exists
        const existingProfile = await UserProfileExtended.findOne({userId})
        if(existingProfile){
            return res.status(400).json({
                success: false,
                message: "Profile already exists"
            })
        }

        // validate gender enum
        const validateGender = ['Male', 'Female', 'Other']
        if(!validateGender.includes(gender)){
            return res.status(400).json({
                success: false,
                message: "Invalid gender value"
            })
        }

        // validate marital status
        const validateMarital = ['Married', 'Unmarried']
        if(!validateMarital.includes(maritalStatus)){
            return res.status(400).json({
                success: false,
                message: "Invalid Marital Status"
            })
        }

        // validate dateOfBirth
        const dob = new Date(dateOfBirth);
        const today = new Date();
        if (dob >= today) {
            return res.status(400).json({
                success: false,
                message: "Date of Birth must be in the past"
            });
        }

        // validate address
        if(!address.streetAddress || !address.cityName || !address.stateName || !address.countryName || !address.pinCode){
            return res.status(400).json({
                success: false,
                message: "Complete Address details are required"
            })
        }

        // validate emergency contact if provided
        if(emergencyContact && emergencyContact.phone){
            const phoneRegex = /^[0-9]{7,15}$/;
            if (!phoneRegex.test(emergencyContact.phone)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid emergency contact phone number"
                });
            }
        }

        // Create new profile
        const profile = new UserProfileExtended({
            userId,
            gender,
            dateOfBirth,
            profileImageUrl: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            bio,
            maritalStatus,
            address,
            emergencyContact
        })

        await profile.save()

        // Log activity
        await ActivityLog.create({
            userId,
            type: "Profile",
            description: "User Created profile",
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(201).json({
            success: true,
            message: "User Profile Created successfully",
            data: profile
        })

    } catch (error) {
        console.error("Error while creating profile: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong creating profile"
        })
    }
}

// Get User Profile Controller
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id // Extracted from auth middleware
        const profile = await UserProfileExtended.findOne({userId}).populate("userId", "email username role")

        if(!profile){
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile
        })
    } catch (error) {
        console.error("Error while fetching the profile: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the profile"
        })
    }
}

// Controller to get user profile by Id (Admin)
exports.getProfileById = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role != "admin"){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can fetch profiles by ID"
            })
        }

        const targetUserID = req.params.id
        const profile = await UserProfileExtended.findOne({userId: targetUserID}).populate("userId", "email username role")

        if(!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }

        // Log Admin Activity
        await ActivityLog.create({
            userId: req.user.id, // admin performing actions
            type: "Admin",
            description: `Admin fetched profile of ${targetUserID}`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile
        })
    } catch (error) {
        console.error("Error while fetching the profile by ID: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the profile by ID"
        })
    }
}

// Controller to get all the profiles (admin)
exports.getAllProfiles = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role != "admin"){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can fetch profiles by ID"
            })
        }

        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        // Filtering
        const filters = {}
        if(req.query.gender) filters.gender = req.query.gender
        if(req.query.maritalStatus) filters.maritalStatus = req.query.maritalStatus
        if(req.query.cityName) filters["address.cityName"] = req.query.cityName
        if(req.query.stateName) filters["address.StateName"] = req.query.stateName

        // Sorting
        const sortBy = req.query.sortBy || "CreatedAt"
        const order = req.query.order === "asc" ? 1 : -1

        // Query
        const profiles = await UserProfileExtended.find(filters)
        .populate("userId", "email username role")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

        const totalProfiles = await UserProfileExtended.countDocuments(filters)

        // Log Admin action
        await ActivityLog.create({
            userId: req.user.id,
            type: "Admin",
            description: `Admin fetched all the profiles (page: ${page}, limit: ${limit})`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            pagination: {
                total: totalProfiles,
                page,
                limit,
                totalPages: Math.ceil(totalProfiles/limit)
            },
            data: profiles
        })

    } catch (error) {
        console.log("Error while fetching all the profiles: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching all the profiles"
        })
    }
}