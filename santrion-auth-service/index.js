// Importing required modules/packages
const express = require("express")
const connectDB = require("./src/config/db")
const cookieParser = require("cookie-parser")
const authenticationRoutes = require("./src/routes/auth.route")
const otpRoutes = require("./src/routes/otp.route")
const cors = require("cors")
require("./src/utils/redisClient.utils");

// Creating an instance for express
const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:4000",
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
})

// Registering the routes
app.use("/api/v1/auth", authenticationRoutes)
app.use("/api/v1/otp", otpRoutes)

// Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is up and running..."
    })
})