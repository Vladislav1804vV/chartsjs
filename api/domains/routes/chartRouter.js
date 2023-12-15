const {Router} = require("express");
const ChartController = require('../controllers/chartController')

const router = Router({strict: false})

router.post('/render', ChartController.render)

module.exports = router
