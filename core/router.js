const express = require('express')
const app = express.Router()

module.exports = app

const emrAssistUrls = require('../emr_assist/router')
app.use('/emr_assist', emrAssistUrls)


module.exports = app

// we can move connections, middlewares to core as well