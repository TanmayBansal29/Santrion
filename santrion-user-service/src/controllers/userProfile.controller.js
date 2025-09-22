const ActivityLog = require("../models/ActivityLog.model")
const UserProfileExtended = require("../models/UserProfile.model")


// Create User Profile Controller
exports.createProfile = async (req, res) => {
    try {
        const userId = req.user.id  // Extracted from auth middleware
        const {gender, dateOfBirth, profileImageUrl, bio, martialStatus, address, emergencyContact} = req.body

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
        if(!validateMarital.includes(martialStatus)){
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
            martialStatus,
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
            message: "User Profile Created successfully"
        })

    } catch (error) {
        console.error("Error while creating profile: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong creating profile"
        })
    }
}