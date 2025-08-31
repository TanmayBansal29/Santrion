const express = require("express")
const { logout, logoutAllDevices, logoutSpecificDevice } = require("../controllers/refreshToken.controller")
const router = express.Router()

// Logout Route
router.post("/logout", logout)

// Logout All Devices Route
router.post("/logout/all-devices", logoutAllDevices)

// Logout specific device
router.post("/logout/specific-device", logoutSpecificDevice)

module.exports = router