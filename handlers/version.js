const { OK } = require('../utils/httpResponse')

async function version(req, res, next) {

	return OK(res, { 'version': '1.0.0' })

}

module.exports = {
	version,
}