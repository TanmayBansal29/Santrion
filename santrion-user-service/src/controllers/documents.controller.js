const ActivityLog = require("../models/ActivityLog.model")
const GeneralDocuments = require("../models/Documents.model")
const CloudinaryService = require("../services/cloudinaryService")
const streamifier = require("streamifier")

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
                    },
                    (error, result) => {
                        if(error) reject (error)
                        else resolve(result)
                    }
                )
                streamifier.createReadStream(req.file.buffer).pipe(stream)
            })
        }

        const result = await uploadToCloudinary()

        // Save document metadata
        const document = await GeneralDocuments.create({
            userId,
            name: req.file.originalname,
            type: type || "other",
            url: result.secure_url,
            fileSize: req.file.size,
            fileFormat: req.file.mimetype,
        });

        // Log activity
        await ActivityLog.create({
            userId,
            type: "DOCUMENT_UPLOADED",
            description: `User uploaded a new ${document.type} document`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"],
        });

        return res.status(200).json({
            success: false,
            message: "Document Uploaded successfully",
            data: document
        })

    } catch (error) {
        console.log("Error while uploading the document: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong uploading the document"
        })  
    }
}

// Controller to get all my documents
exports.getMyDocuments = async (req, res) => {
    try {
        const userId = req.user.id // extracted from auth middleware

        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        // Filtering
        const filters = { userId }
        if(req.query.type) filters.type = req.query.type

        // Sorting
        const sortBy = req.query.sortBy || "createdAt"
        const order = req.query.order === "asc" ? 1 : -1

        // Query
        const documents = await GeneralDocuments.find(filters)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

        const totalDocuments = await GeneralDocuments.countDocuments(filters)

        // Log Action
        await ActivityLog.create({
            userId,
            type: "DOCUMENTS_FETCHED",
            description: "User fetched all documents belonging to them",
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Documents fetched Successfully",
            pagination: {
                total: totalDocuments,
                page,
                limit,
                totalPages: Math.ceil(totalDocuments/limit)
            },
            data: documents
        })

    } catch (error) {
        console.error("Error while getting user documents: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting user documents"
        })
    }
}

// Controller to get all the documents (Admin)
exports.getAllDocuments = async (req, res) => {
    try {
        // Ensuring only admins can use this
        if(req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can use this"
            })
        }

        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        // Filtering
        const filters = {}
        if(req.query.type) filters.type = req.query.type

        // Sorting
        const sortBy = req.query.sortBy || "createdAt"
        const order = req.query.order === "asc" ? 1 : -1

        // Query
        const documents = await GeneralDocuments.find(filters)
        .populate("userId", "username email role")
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

        const totalDocuments = await GeneralDocuments.countDocuments(filters)

        // Log Action
        await ActivityLog.create({
            userId: req.user.id,
            type: "ADMIN_DOCUMENTS_FETCHED",
            description: `Admin fetched all the documents (page: ${page}, limit: ${limit})`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"]
        })

        return res.status(200).json({
            success: true,
            message: "Documents fetched Successfully",
            pagination: {
                total: totalDocuments,
                page,
                limit,
                totalPages: Math.ceil(totalDocuments/limit)
            },
            data: documents
        })

    } catch (error) {
        console.error("Error while getting all the docuemnts: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching all the documents"
        })
    }
}

// Controller to get single document by ID
exports.getDocumentById = async (req, res) => {
    try {
        const userId = req.user.id // extracted from auth middleware
        const documentId = req.params.id 

        // If admin, they can fetch any document
        const query = req.user.role === "admin" ? { _id: documentId } : { _id: documentId, userId }
        const document = await GeneralDocuments
        .findOne(query)
        .populate("userId", "username email role");

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "No Document found"
            })
        }

        // Logging Action
        await ActivityLog.create({
            userId,
            type: "DOCUMENT_FETCHED",
            description: `User fetched document with ID ${documentId}`,
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"],
        });

        return res.status(200).json({
            success: true,
            message: "Document fetched successfully",
            data: document
        })
        
    } catch (error) {
        console.error("Error while fetching a document by ID: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching a particular document"
        })
    }
}