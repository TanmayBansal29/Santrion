// Importing required packages
const mongoose = require("mongoose")
require("dotenv").config()

// Creating a function that helps in database connection
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
}

// Exporting created function
module.exports = connectDB