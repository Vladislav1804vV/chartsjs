const express = require('express')
const cors = require('cors')
const config = require('config')
const errorMiddleware = require('./middlewares/errorMiddleware')

const CLIENT_URL = process.env.CLIENT_URL || config.get('clientURL')

const app = express()

app.use(express.json())

app.use(cors({
    credentials: true,
    origin: CLIENT_URL
}))

app.use('/api/charts', require('./domains/routes/chartRouter'))

app.use(errorMiddleware)

module.exports = app
