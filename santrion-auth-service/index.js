// Importing required modules/packages
const express = require("express")
const connectDB = require("./src/config/db")
require("dotenv").config()

// Creating an instance for express
const app = express()

// Creating connection to database
connectDB().then(() => {
    console.log("Database Connection Established")
    app.listen(process.env.PORT, () => {
        console.log(`Server Listening at PORT ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error("Failed to connect to server", err)
})