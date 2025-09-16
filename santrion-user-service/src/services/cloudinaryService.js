const cloudinary = require("../config/cloudinary")

class CloudinaryService {
    /***
     * upload file to cloudinary
     * @param {Buffer} fileBuffer - file Buffer from multer
     * @param {String} folder - Cloudinary folder path (e.g. users/profile_pics)
     * @param {Object} options - Extra Cloudinary options
     */

    static async uploadFile(fileBuffer, folder, options = {}) {
        try {
            const result = await cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "auto", // auto-detects pdf/image/video
                    ...options
                },
                (error, result) => {
                    if(error) throw error
                    return result
                }
            )
            return {
                success: true,
                url: result.secure_url,
                public_id: result.public_id
            }
        } catch (error) {
            console.error("❌ Cloudinary Upload Error:", error);
            throw new Error("File upload failed. Please try again later.");
        }
    }

    /***
     * Delete file from cloudinary
     * @param {String} publicId - Cloudinary public_id
     */
    static async deleteFile(publicId){
        try{
            await cloudinary.uploader.destroy(publicId)
            return {
                success: true,
                message: "File Deleted Successfully"
            }
        } catch (error) {
            console.error("❌ Cloudinary Delete Error:", error);
            throw new Error("File deletion failed. Please try again later.");
        }
    }

    /***
     * Generate signed URL (for private docs like medical reports)
     * @param {String} publicId
     * @param {Number} expiry - Expiry in seconds
     */

    static generateSignedUrl(publicId, expiry = 300) {
        try {
            const url = cloudinary.url(publicId, {
                secure: true,
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + expiry
            })
            return {
                success: true,
                message: url
            }
        } catch (error) {
            console.error("❌ Cloudinary Signed URL Error:", error);
            throw new Error("Failed to generate signed URL.");
        }
    }
}

module.exports = CloudinaryService