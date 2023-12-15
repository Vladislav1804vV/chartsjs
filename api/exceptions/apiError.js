module.exports = class ApiError extends Error {
    constructor(status, message, reason = []) {
        super(message)
        this.status = status
        this.reason = reason
    }

    static BadRequest(message, reason = {}) {
        return new ApiError(400, message, reason)
    }
}
