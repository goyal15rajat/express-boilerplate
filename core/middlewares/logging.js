const addRequestResponseLogger = (req, res, next) => {
	const log = require('../../utils/logger')
	log.logRequest(req)
	res.on('finish', () => {
		log.logResponse(req, res, {
			meta: {
				responseContent: {},
				requestPath: req.baseUrl + req.path
			}
		})
	})
	next()
}

module.exports = {
	addRequestResponseLogger,
}