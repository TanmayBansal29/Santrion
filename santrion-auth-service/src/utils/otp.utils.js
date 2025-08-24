// Importing required packages
const crypto = require("crypto")
const redisClient = require("./redisClient.utils")
const OtpModel = require("../models/Otp.model")
const mailer = require("./mailer.utils")
const otpVerification = require("../mails/otpVerification.mail")

// Defining the constants
const OTP_EXPIRY = 300
const MAX_RESENDS = 3

// Generating random 6 digit OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString()
}

// Logic for sending the otp
exports.sendOtp = async ({email, purpose, channel, ipAddress, userAgent}) => {
    const key = `otp:${purpose}:${email}`
    const otp = generateOTP()

    // checking the resend count
    const resendKey = `${key}:resends`
    let resendCount = await redisClient.get(resendKey)
    resendCount = resendCount ? parseInt(resendCount, 10) : 0

    if(resendCount >= MAX_RESENDS){
        throw new Error("Resend limit Reached! Please try again later")
    }

    // Save OTP in Redis
    await redisClient.setEx(key, OTP_EXPIRY, String(otp));

    // Track resend count separately
    await redisClient.setEx(resendKey, 3600, String(resendCount + 1))

    // Save log in Mongo
    await OtpModel.create({
        email,
        purpose,
        channel,
        expiresAt: new Date(Date.now() + OTP_EXPIRY * 1000),
        ipAddress: ipAddress || "unknown",
        userAgent: userAgent || "unknown",
        resendCount: resendCount + 1
    })

    // Send OTP Email
    await mailer(
        email,
        "Your One Time Password (OTP) for Account Registration",
        otpVerification(otp)
    )
}

// Logic for verifying the otp
exports.verifyOtp = async ({email, purpose, otp}) => {
    const key = `otp:${purpose}:${email}`
    const storedOtp = await redisClient.get(key)
    console.log("Checking Redis for key:", key, "Got:", otp);
    console.log("Stored OTP:", storedOtp, "Input OTP:", otp);

    if(!otp) {
        throw new Error("OTP expired or not found")
    }

    // If otp entered not correct
    if(String(storedOtp) != String(otp)) {
        // Update attemptCount in Mongo
        await OtpModel.findOneAndUpdate(
            {email, purpose},
            {$inc: {attemptCount: 1}, status: "failed"},
            {sort: {createdAt: -1}}
        );
        throw new Error("Invalid OTP")
    }

    // Mark Verified in Mongo
    await OtpModel.findOneAndUpdate(
        {email, purpose},
        {isVerified: true, verifiedAt: new Date(), status: "verified"},
        {sort: {createdAt: -1}}
    )

    // Delete OTP from Redis
    await redisClient.del(key)

    return true
}