require('dotenv').config()

const express = require('express')
const app = express()

// Connections
require('./config/databases/mongoose')

// Middlewares
app.use(express.json())

const logging_middleware = require('./middlewares/logging')
app.use(logging_middleware.addRequestResponseLogger)

// Log
const log = require('./utils/logger')

// HTTP Errors
const { NotFound } = require('./utils/httpError')

const apiRouter = require('./routes/router')
app.use('/boilerplate', apiRouter)

app.all('*', (req, res, next) => {
	next(new NotFound({ message: 'Route Not Found' }))
})

// Error Handler Middlware
const error_handling_middleware = require('./middlewares/error_handling')
app.use(error_handling_middleware.errorHandler)

process.on('uncaughtException', (err) => {
	log.logApp({
		level: 'error',
		message: 'UNCAUGHT_EXCEPTION_ERROR',
		errors: err
	})
	process.exit(1)
})

process.on('unhandledRejection', (err) => {
    log.logApp({
		level: 'error',
		message: 'UNHANDLED_REJECTION_ERROR',
		errors: err
	})
	process.exit(1)
})	

module.exports = app