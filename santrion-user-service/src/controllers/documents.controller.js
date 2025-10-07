const CloudinaryService = require("../services/cloudinaryService")


// controller to upload a document
exports.uploadDocument = async (req, res) => {
    try {
        const userId = req.user.id // Extracted from auth middleware
        
        if(!req.file) {
            return res.status(404).json({
                success: false,
                message: "No file uploaded, please upload a file"
            })
        }

        const {type} = req.body
        // Validating file type and size
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
        if(!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Allowed type JPEG, PNG, PDF"
            })
        }

        const maxSize = 5 * 1024 * 1024  // 5 MB
        if(req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size too large. Max allowed size is 5 MB"
            })
        }

        // Upload to cloudinary
        const uploadToCloudinary = () => {
            new Promise ((resolve, reject) => {
                const stream = CloudinaryService.cloudinary.uploaded.upload_stream(
                    {
                        folder: `users/${userId}/documents`,
                        resource_type: "auto"
                    }
                )
            })
        }

    } catch (error) {
        console.log("Error while uploading the document: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong uploading the document"
        })
    }
}