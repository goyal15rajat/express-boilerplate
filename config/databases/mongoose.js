const mongoose = require('mongoose')
const log = require('../../utils/logger')
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_DB = process.env.MONGO_DB
mongoose.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

mongoose.connection.on('open', () => {
	console.log('Mongo Client Connected')
})
mongoose.connection.on('error', (err) => {
	console.log(err)
	console.log('Unable to connect to Mongo')
})
mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
	log.logApp({
		meta: {
			collectionName,
			methodName,
			methodArgs
		}
	})
})

// Use this to create Schema/Models
module.exports = mongoose