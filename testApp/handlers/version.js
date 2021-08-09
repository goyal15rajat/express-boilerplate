const { OK } = require('../../utils/httpResponse')
const asyncHandler = require('../../core/middlewares/async')
const { BadRequest, NotFound, InternalServerError } = require('../../utils/httpError')

const version = asyncHandler(
	async (req, res, next) => {
		return OK(res, { 'version': '1.0.0' })
	}
)

module.exports = {
	version,
}