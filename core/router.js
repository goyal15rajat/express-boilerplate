const express = require('express')
const app = express.Router()

module.exports = app

const testAppUrls = require('../testApp/router')
app.use('/test_app', testAppUrls)


module.exports = app

