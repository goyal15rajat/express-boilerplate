/*
HTTP Errors

Requires TLS state

Usage:
	const { BadRequest, NotFound, InternalServerError } = require('path/to/httpError.js')
	throw new BadRequest({
		message: 'Got a Bad Request!',
		errorCode: 123,
		errors: {
			something: 'failed'
		},
		...
		...
		...
	})

Supported Errors:
	All Status Codes except 2xx, by number as well as by name
*/

const statusCodes = require('http').STATUS_CODES
const state = require('./TLS')

const defaultMessage = {
	BadRequest: 'The request is invalid. Please try again.',
	GatewayTimeout: 'Cant connect to server at this moment.\nIf the issue persists please contact support.',
}

function createError(statusCode, name) {
	return class extends Error {
		/*
			  Error Exception to be extended for various Http error status codes

			Attributes:
				errors: errors object (optional) revealing more details to be sent in response
				response: response body to be sent
		*/
		constructor({
			message,
			errorCode,
			errors = {},
			title,
			errorSubCode,
			requestId
		}) {
			super()
			this.name = name
			this.response = {
				statusCode,
				error: {
					message: message || defaultMessage[name] || '',
					code: errorCode,
					errors,
					title,
					subCode: errorSubCode,

				},
				metadata: {
					requestId: requestId || state.get('requestId')
				}
			}

			this.errors = errors
		}
	}
}

Object.entries(statusCodes)
	.filter(statusCode => statusCode[0] < 200 || statusCode[0] >= 300)
	.forEach(([code, name]) => {
		name = name.split(' ').join('')
		name = name.replace(/[^a-zA-Z]/g, '')
		code = Number(code)
		module.exports[name] = createError(code, name)
		module.exports[code] = createError(code, String(code))
	})

/*
100 Continue
101 SwitchingProtocols
102 Processing
103 EarlyHints
300 MultipleChoices
301 MovedPermanently
302 Found
303 SeeOther
304 NotModified
305 UseProxy
307 TemporaryRedirect
308 PermanentRedirect
400 BadRequest
401 Unauthorized
402 PaymentRequired
403 Forbidden
404 NotFound
405 MethodNotAllowed
406 NotAcceptable
407 ProxyAuthenticationRequired
408 RequestTimeout
409 Conflict
410 Gone
411 LengthRequired
412 PreconditionFailed
413 PayloadTooLarge
414 URITooLong
415 UnsupportedMediaType
416 RangeNotSatisfiable
417 ExpectationFailed
418 ImaTeapot
421 MisdirectedRequest
422 UnprocessableEntity
423 Locked
424 FailedDependency
425 TooEarly
426 UpgradeRequired
428 PreconditionRequired
429 TooManyRequests
431 RequestHeaderFieldsTooLarge
451 UnavailableForLegalReasons
500 InternalServerError
501 NotImplemented
502 BadGateway
503 ServiceUnavailable
504 GatewayTimeout
505 HTTPVersionNotSupported
506 VariantAlsoNegotiates
507 InsufficientStorage
508 LoopDetected
509 BandwidthLimitExceeded
510 NotExtended
511 NetworkAuthenticationRequired
*/