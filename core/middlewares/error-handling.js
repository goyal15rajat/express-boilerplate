const log = require('../utils/logger')
const request_id_middleware = require('./request-id')
const { InternalServerError } = require('../utils/http-error')

const errorHandler = (err, req, res, next) => {

	// Let express handle it
	if (res.headersSent) {
		return next(err)
	}

	// Handle our httpError
	if (err.response && err.response.statusCode) {
		log.logApp({
			level: 'error',
			message: 'ERROR',
			error: err.response
		})
		res.status(err.response.statusCode).json(err.response)
	} else {
		// Handle our express app error
		log.logApp({
			level: 'error',
			message: 'ERROR',
			error: JSON.stringify(err, Object.getOwnPropertyNames(err)) || err
		})
		res.status(500).send({
			"statusCode": 500,
			"error": {
				"message": "Looks like something went wrong! Please try again.\nIf the issue persists please contact support."
			},
			"metadata": {
				"requestId": request_id_middleware.asyncLocalStorage && request_id_middleware.asyncLocalStorage.getStore() ? request_id_middleware.asyncLocalStorage.getStore().get('requestId') : NaN
			}
		})
	}
}

module.exports = {
	errorHandler,
}