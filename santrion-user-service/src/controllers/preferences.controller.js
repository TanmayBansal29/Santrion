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

// Controller to reset preferences to default
exports.resetPreferences = async (req, res) => {
    try {
        const userId = req.user.id // Extract from auth middleware

        const defaultPreferences = {
            language: "en",
            timeZone: "Asia/Kolkata",
            theme: "System",
            notificationSettings: {
                emailSettings: true,
                smsSettings: true,
                pushNotifications: true
            },
            privacySettings: {
                shareProfileWithDoctors: false,
                shareDataForResearch: false,
                allowMarketingEmails: false
            }
        }

        // Update or create preferences
        const preferences = await Preferences.findOneAndUpdate(
            {userId},
            {$set: defaultPreferences},
            {new: true, upsert: true} // upsert ensures creation if missing
        )

        // Log Activity
        await ActivityLog.create({
            userId,
            type: "RESET_PREFERENCES",
            description: "User reset the preferences",
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent']
        })

        return res.status(200).json({
            success: true,
            message: "Preferences reset successfully",
            data: preferences
        })
    } catch (error) {
        console.error("Error while resetting the preferences: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the preferences"
        })
    }
}

// Controller to get preferences for any user (Admin)
exports.getUserPreferences = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can access this"
            })
        }

        const targetedId = req.params.userId
        let preferences = await Preferences.findOne({userId: targetedId})

        if(!preferences) {
            preferences = await Preferences.create({userId: targetedId})

            try {
                await ActivityLog.create({
                    userId: req.user.id,
                    type: "CREATE_PREFERENCES",
                    description: "Default preferences created",
                    ipAddress: req.ip,
                    deviceInfo: req.headers['user-agent']
                })
            } catch (error) {
                console.error("Error while logging the activity: ", error)
            }
        }

        return res.status(200).json({
            success: true,
            message: `Preferences fetched successfully for user ${targetedId}`,
            data: preferences
        })

    } catch (error) {
        console.error("Error while getting user preferences: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting user preferences"
        })
    }
}

// Controller to get all user preferences
exports.getAllPreferences = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can be access this"
            })
        }

        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        // Filtering
        const filters = {}
        if(req.query.language) filters.language = req.query.language
        if(req.query.timeZone) filters.timeZone = req.query.timeZone
        if(req.query.theme) filters.theme = req.query.theme

        // Sorting
        const sortBy = req.query.sortBy || "createdAt"
        const order = req.query.order === "asc" ? 1 : -1

        // Query
        const preferences = await Preferences.find(filters)
        .populate("userId", "email username role")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

        const totalPreferences = await Preferences.countDocuments(filters)

        // Log Admin actions
        await ActivityLog.create({
            userId: req.user.id,
            type: "ADMIN_FETCHED_PREFERENCES",
            description: `Admin fetched all the preferences (page: ${page}, limit: ${limit})`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Preferences fetched successfully",
            pagination: {
                total: totalPreferences,
                page,
                limit,
                totalPages: Math.ceil(totalPreferences/limit)
            },
            data: preferences
        })

    } catch (error) {
        console.error("Error while getting all the preferences: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting all the preferences"
        })
    }
}