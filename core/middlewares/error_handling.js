const errorHandler = (err, req, res, next) => {
	// Let express handle it
	if (res.headersSent)
		return next(err)

	const log = require('../../utils/logger')
	log.logApp({
		level: 'error',
		message: 'ERROR',
		error: err
	})

	// Handle our httpError
	if (err.response && err.response.statusCode)
		res.status(err.response.statusCode).send(err.response)
	// Let express handle anything else
	else
		next(err)
}

module.exports = {
	errorHandler,
}