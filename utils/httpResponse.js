/*
HTTP Responses

Requires TLS state

Usage:
	const { OK, NoContent } = require('path/to/httpResponse.js')
	OK(res) // Sends a 200 response with empty response body with res.send()
	OK(res, data) // Sends a 200 response with data as the response body with res.send()
	OK(res, data, true) // Sends a 200 response with data as the response body with res.json()

Supported Responses:
	200 OK
	201 Created
	204 NoContent
*/

// const statusCodes = require('http').STATUS_CODES
const request_id_middleware = require('../core/middlewares/requestId')

function getMetaData() {

	return {
		requestId: request_id_middleware.asyncLocalStorage && request_id_middleware.asyncLocalStorage.getStore() ? request_id_middleware.asyncLocalStorage.getStore().get('requestId') : NaN
	}
}

function createResponse(statusCode, json = true) {
	return function (res, data = {}, json) {
		/*
			Sends a HTTP Response with a specified status code
			Should be enclosed in a Try/Catch as res.send()/json() may throw errors if incorrect data is passed

			Args:
				res: Express Response Object associated with a request
				data: (optional) The data object to be sent as the response body
				json: (optional) A boolean specifying whether res.json() is to be used

			Returns:
				Nothing
		*/
		data['metadata'] = {
			...data['metadata'],
			...getMetaData()
		}

		if (json === true)
			res.status(statusCode).json(data)
		else
			res.status(statusCode).send(data)
	}
}

/*
	Refer to httpError.js for building Responses automatically
*/
module.exports = {
	OK: createResponse(200),
	Created: createResponse(201),
	NoContent: createResponse(204, json=false),
}
