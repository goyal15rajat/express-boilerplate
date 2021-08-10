const { OK } = require('../../utils/http-response')
const asyncHandler = require('../../core/middlewares/async')

const version = asyncHandler(
	async (req, res, next) => {
		return OK(res, { 'version': '1.0.0' })
	}
)

module.exports = {
	version,
}