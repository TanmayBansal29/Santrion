class ApiError {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
        this.success = false
    }
}

module.exports = ApiError