// Importing required packages
const path = require("path")
const multer = require("multer")

// Allowed file types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]
const ALLOWED_DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

// File Filter Function
const fileFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype) || ALLOWED_DOC_TYPES.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(new Error("Invalid file type. Only images and PDFs/Docs are allowed"))
    }
}

// Multer storage in memory (not disk, safer for cloud upload)
const storage = multer.memoryStorage

// Multer Instance
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB file limit
    },
    fileFilter
})

module.exports = upload