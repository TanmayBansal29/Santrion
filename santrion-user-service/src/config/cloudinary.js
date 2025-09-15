// Importing required packages
const cloudinary = require("cloudinary").v2
require("dotenv").config()

// Validating the env variables (fail fast)
if(!process.env.CLOUDINARY_CLOUD_NAME
    || !process.env.CLOUDINARY_API_KEY
    || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error ("Missing Cloudinary environment variables. Please check .env file")
    }

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // always use HTTPS
})

module.exports = cloudinary