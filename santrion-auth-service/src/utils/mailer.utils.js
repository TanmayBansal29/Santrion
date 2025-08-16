// Importing required modules
const nodemailer = require("nodemailer")
require("dotenv").config()

// Created a mailer util that takes email, title, body
const mailer = async (email, title, body) => {
    try {
        // Created a transporter having the attributes host, auth.user, auth.pass
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // On the transporter implied the send mail method
        let info = await transporter.sendMail({
            from: 'Santrion || Connecting Care With Intelligence <no-reply@santrion.com>',
            to: email,
            subject: title,
            html: body
        })
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