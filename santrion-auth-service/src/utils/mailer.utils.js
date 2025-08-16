// Importing required modules
const nodemailer = require("nodemailer")
require("dotenv").config()

// Creating reusable transporter (created only once)
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

/**
 * Mailer Utility
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - Email HTML body
 */

// Created a mailer util that takes email, title, body
const mailer = async (email, title, body) => {
    try {
        // On the transporter implied the send mail method
        let info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: title,
            html: body
        })

        if (process.env.NODE_ENV !== "Production") {
            console.log("Email Sent: ", info.messageId)
        }
        
        return {success: true, info}
    } catch (error) {
        // Logging the Error
        console.log("Error Occurred: ", error)
        return {
            success: false,
            message: error.message
        }
    }
}

module.exports = mailer