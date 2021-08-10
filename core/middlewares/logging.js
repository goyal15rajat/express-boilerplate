const addRequestResponseLogger = (req, res, next) => {
	const log = require('../../utils/logger')
	log.logRequest(req)
	res.on('finish', () => {
		let responseContent =  '{}'

		if (!res.statusCode || res.statusCode/100 != 2) {
			// console.log(res)
			if (typeof res.responseContent === 'object' && res.responseContent !== null) {
				responseContent = JSON.stringify(res.responseContent)
			}
			else {
				responseContent = 'unprocessable response or error'
			}
		}

		log.logResponse(req, res, {
			meta: {
				responseContent: responseContent,
				requestPath: req.baseUrl + req.path
			}
		})
	})
	next()
}

module.exports = {
	addRequestResponseLogger,
}