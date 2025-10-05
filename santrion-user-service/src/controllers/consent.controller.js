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

        // Update status to revoked
        consent.status = "revoked"
        consent.revokedAt = new Date()

        await consent.save()

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
            data: consent
        })

    } catch (error) {
        console.error("Error while withdrawing the consent: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while withdrawing the consent"
        })
    }
}