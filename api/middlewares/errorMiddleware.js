const ApiError = require('../exceptions/apiError')

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        const data = {message: err.message, reason: err.reason}
        return res.status(err.status).json(data)
    }
    const data = {message: 'Непредвиденная ошибка: ' + err.message}
    return res.status(500).json(data)
}
