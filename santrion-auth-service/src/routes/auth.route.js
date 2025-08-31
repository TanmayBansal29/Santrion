// Importing required packages
const express = require("express")
const { signup, login } = require("../controllers/auth.controller")
const { auth } = require("../middlewares/auth")
const router = express.Router()

// Signup Route
router.post("/signup", signup)

// Login Route
router.post("/login", auth, login)

module.exports = router