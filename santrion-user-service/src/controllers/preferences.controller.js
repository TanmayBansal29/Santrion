const Preferences = require("../models/Preferences.model")

// Controller for user to get their preferences
exports.getMyPreferences = async (req, res) => {
    try {
        const userId = req.user.id // Extracted from auth middleware
        let preferences = await Preferences
        .findOne({userId})
        .populate("userId", "email username role")

        if (!preferences) {
            preferences = await Preferences.create({ userId });
        }

        // Log activity
        await ActivityLog.create({
            userId,
            type: "GET_PREFERENCES",
            description: "User accessed their preferences",
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        });

        return res.status(200).json({
            success: true,
            message: "Preferences fetched successfully",
            data: preferences
        })

    } catch (error) {
        console.error("Error while getting user preferences: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong getting the preferences"
        })
    }
}

// Controller for user to update the user preferences
exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id // Extracted from auth middleware
        const updates = req.body

        // Allowed top level fields to update
        const allowedFields = ['language', 'timezone', 'theme', 'notificationSettings', 'privacySettings']

        // Filter only allowed fields
        const filteredUpdates = {};
        for (const key of Object.keys(updates)) {
            if (allowedFields.includes(key)) filteredUpdates[key] = updates[key];
        }

        if(Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for updates'
            })
        }

        // Fetch existing preferences or fetch defaults
        const preferences  = await Preferences.findOne({userId})
        if(!preferences){
            preferences = await Preferences.create({ userId })
        }

        // Validate and merge updates
        if(filteredUpdates.language) {
            if(!Preferences.schema.path("language").enumValues.includes(filteredUpdates.language)){
                return res.status(400).json({
                    success: false,
                    message: `Invalid language. Allowed: ${Preferences.schema.path("language").enumValues.join(", ")}`
                })
            }
            preferences.language = filteredUpdates.language
        }

        if(filteredUpdates.timeZone) {
            if(!Preferences.schema.path("timeZone").enumValues.includes(filteredUpdates.timeZone)){
                return res.status(400).json({
                    success: false,
                    message: `Invalid timeZone. Allowed: ${Preferences.schema.path("timeZone").enumValues.join(", ")}`
                })
            }
            preferences.timeZone = filteredUpdates.timeZone
        }

        if(filteredUpdates.theme) {
            if(!Preferences.schema.path("theme").enumValues.includes(filteredUpdates.theme)){
                return res.status(400).json({
                    success: false,
                    message: `Invalid theme. Allowed: ${Preferences.schema.path("theme").enumValues.join(", ")}`
                })
            }
            preferences.theme = filteredUpdates.theme
        }

        // Merge nested objects safely
        if(filteredUpdates.notificationSettings) {
            preferences.notificationSettings = {
                ...preferences.notificationSettings.toObject(),
                ...filteredUpdates.notificationSettings
            }
        }

        if(filteredUpdates.privacySettings) {
            preferences.privacySettings = {
                ...preferences.privacySettings.toObject(),
                ...filteredUpdates.privacySettings
            }
        }

        await preferences.save()

        // Log User Activity
        await ActivityLog.create({
            userId,
            type: "UPDATE_PREFERENCES",
            description: "User updated preferences",
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        })

        return res.status(200).json({
            success: true,
            message: "Preferences updated successfully",
            data: preferences
        })
        
    } catch (error) {
        console.error("Error while updating the preferences: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong updating the preferences"
        })
    }
}