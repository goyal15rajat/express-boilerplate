process.env.NODE_ENV = 'test'

const ENV_SETTINGS = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV,
    DATABASES: {
        MONGO: {
            HOST: process.env.MONGO_HOST || '127.0.0.1',
            PORT: process.env.MONGO_PORT || '27017',
            DB_NAME: process.env.MONGO_DBNAME || 'test-boilerplate',
        }
    }
};

module.exports = ENV_SETTINGS