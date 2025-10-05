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