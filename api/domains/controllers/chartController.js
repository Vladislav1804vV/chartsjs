const ChartService = require('../services/chartService')

class ChartController {
    async render(req, res, next) {
        try {
            const data = req.body
            return res.json({
                result: await ChartService.createBase64(data)
            })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ChartController()
