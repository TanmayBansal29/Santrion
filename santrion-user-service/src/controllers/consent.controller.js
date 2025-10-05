const ActivityLog = require("../models/ActivityLog.model")
const { CONSENT_TYPES, Consent } = require("../models/Consent.model")

// Controller to give the consent
exports.giveConsent = async (req,res) => {
    try {
        const userId = req.user.id // Extract from auth middleware
        const {consentType, status, notes} = req.body

        // Validate consent type
        if(!CONSENT_TYPES.includes(consentType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid consent type. Allowed: ${CONSENT_TYPES.join(", ")}`
            })
        }

        // Validate Status
        if(!["granted", "revoked"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Status. Must be either 'granted' or 'revoked'"
            })
        }

        // Create new consent entry (append-only)
        const newConsent = await Consent.create({
            userId,
            consentType,
            status,
            collectedBy: "user",
            notes: notes || "",
            ipAddress: req.ip,
            deviceInfo: req.headers['user-agent'],
            givenAt: status === "granted" ? new Date() : undefined,
            revokedAt: status === "revoked" ? new Date() : undefined
        })

        // Logging the activity
        await ActivityLog.create({
            userId,
            type: "Consent",
            description: `User given the consent: ${consentType}`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: `Consent ${status} successfully`,
            data: newConsent
        })
        
    } catch (error) {
        console.error("Error while giving the consent: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong giving the consent"
        })
    }
}

// Controller to get my consents
exports.getMyConsents = async (req, res) => {
    try {
        const userId = req.user.id // Extracted from auth middleware

        // Fetch all consents for this user
        const consents = await Consent.find({userId}).sort({createdAt: -1})

        if(!consents || consents.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No consents found for this user",
                data: []
            })
        }

        // Compute latest status per consent type
        const latestStatus = {};
        for(const consent of consents) {
            if(!latestStatus[consent.consentType]) {
                latestStatus[consent.consentType] = {
                    status: consent.status,
                    updatedAt: consent.updatedAt
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "User consents fetched successfully",
            data: {
                history: consents, // full audit trail
                latest: latestStatus // compact view
            }
        });

    } catch (error) {
        console.error("Error fetching all the consents: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching all the consents"
        })
    }
}

// Controller to update / withdraw the given consent
exports.withdrawConsent = async (req, res) => {
    try {
        const userId = req.user.id // Extracted from middleware
        const consentId = req.params

        // Find the consent that belongs to user
        const consent = await Consent.findOne({
            _id: consentId,
            userId,
            status: "granted"
        })

        if(!consent) {
            return res.status(404).json({
                success: false,
                message: "Consent not found or already withdrawn"
            })
        }

        // create a new revoked consent entry for audit trail
        const revokedConsent = await Consent.create({
            userId,
            consentType: consent.consentType,
            status: "revoked",
            collectedBy: "user",
            notes: `Revoked by User ${req.user.id}`,
            givenAt: consent.givenAt, // keep original grant reference
            revokedAt: new Date()
        });

        // Logging the activity
        await ActivityLog.create({
            userId,
            type: "Consent",
            description: "User Withdrawn consent",
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Consent withdrawn successfully",
            data: {
                consentId: revokedConsent._id,
                consentType: revokedConsent.consentType,
                status: revokedConsent.status,
                revokedAt: revokedConsent.revokedAt
            }
        })

    } catch (error) {
        console.error("Error while withdrawing the consent: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while withdrawing the consent"
        })
    }
}

// Controller to get all the consents (Admin Side)
exports.getAllConsents = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only Admins can access all the consents"
            })
        }

        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        // Filtering
        const filters = {}
        if(req.query.consentType) filters.consentType = req.query.consentType
        if(req.query.status) filters.status = req.query.status
        if (req.query.givenAt) {
            filters.givenAt = { $gte: new Date(req.query.givenAt) };
        }
        if (req.query.revokedAt) {
            filters.revokedAt = { $gte: new Date(req.query.revokedAt) };
        }

        // Sorting
        const sortBy = req.query.sortBy || "createdAt"
        const order = req.query.order === "asc" ? 1 : -1

        // Query
        const consents = await Consent.find(filters)
        .populate("userId", "_id email username role")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

        const totalConsents = await Consent.countDocuments(filters)

        // Log admin action
        await ActivityLog.create({
            userId: req.user.id,
            type: "Admin",
            description: `Admin fetched all the consents (page: ${page}, limit: ${limit})`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Consents fetched successfully",
            pagination: {
                total: totalConsents,
                page,
                limit,
                totalPages: Math.ceil(totalConsents/limit)
            },
            data: consents
        })

    } catch (error) {
        console.error("Error while getting all the consents: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong getting all the consents"
        })
    }
}


// Controller to get consent by user
exports.getUserConsent = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can access this"
            })
        }

        // Fetch all the consents for targeted user
        const targetedId = req.params.id
        const consents = await Consent.find({userId: targetedId})
        .sort({ createdAt: -1 })
        .populate("userId", "_id email username role");

        if(!consents || consents.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No consents found for this user",
                data: []
            })
        }

        // Compute latest status per consent type
        const latestStatus = {};
        for(const consent of consents) {
            if(!latestStatus[consent.consentType]) {
                latestStatus[consent.consentType] = {
                    status: consent.status,
                    updatedAt: consent.updatedAt
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "User consents fetched successfully",
            data: {
                history: consents, // full audit trail
                latest: latestStatus // compact view
            }
        })

    } catch (error) {
        console.error("Error while getting user consent: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting user consent"
        })
    }
}

// Controller to revoke the user consent (Admin)
exports.withdrawUserConsent = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: only admins can use this"
            })
        }

        const targetedId = req.params.id
        const consentId = req.params.consentId

        // Find the consent that belongs to targeted user
        const consent = await Consent.findOne({
            _id: consentId,
            userId: targetedId,
            status: "granted"
        })

        if(!consent){
            return res.status(404).json({
                success: false,
                message: "Consent not found or already withdrawn"
            })
        }

        // create a new revoked consent entry for audit trail
        const revokedConsent = await Consent.create({
            userId: targetUserId,
            consentType: consent.consentType,
            status: "revoked",
            collectedBy: "admin",
            notes: `Revoked by Admin ${req.user.id}`,
            givenAt: consent.givenAt, // keep original grant reference
            revokedAt: new Date()
        });

        // Logging the Activity
        await ActivityLog.create({
            userId: req.user.id,
            type: "ADMIN_WITHDRAW_CONSENT",
            description: `Admin ${req.user.id} withdrew ${consent.consentType} for user ${targetUserId}`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Consent withdrawn successfully",
            data: {
                consentId: revokedConsent._id,
                consentType: revokedConsent.consentType,
                status: revokedConsent.status,
                revokedAt: revokedConsent.revokedAt
            }
        })

    } catch (error) {
        console.error("Error while withdrawing user consent: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while withdrawing user consent"
        })
    }
}