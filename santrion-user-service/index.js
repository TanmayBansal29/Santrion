// Importing required packages
const cookieParser = require("cookie-parser")
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
require("dotenv").config()

// Creating instance of Express
const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "https://localhost:4001",
        credentials: true
    })
)

// Creating connection to database
connectDB().then(() => {
    console.log("Database Connection Established")
    app.listen(process.env.PORT, () => {
        console.log(`Server Listening at PORT ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error("Failed to connect to server", err)
});

// Default Route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is up and running successfully"
    })
})