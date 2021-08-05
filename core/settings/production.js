const ENV_SETTINGS = {
    ENV: 'PRODUCTION',
    PORT: process.env.PORT || 8000,
    DATABASES: {
        MONGO: {
            HOST: process.env.MONGO_HOST,
            PORT: process.env.MONGO_PORT,
            DB_NAME: process.env.MONGO_DB_NAME,
        }
    }
};

module.exports = ENV_SETTINGS
