const { CONSENT_TYPES, Consent } = require("../models/Consent.model")


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