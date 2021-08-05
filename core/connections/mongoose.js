const mongoose = require('mongoose')
const log = require('../../utils/logger')
const SETTINGS = require('../settings/common')

const MONGO_HOSTNAME = SETTINGS.DATABASES.MONGO.HOST
const MONGO_PORT = SETTINGS.DATABASES.MONGO.PORT
const MONGO_DB = SETTINGS.DATABASES.MONGO.DB_NAME

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