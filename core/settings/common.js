const path = require('path');
var ENV_SETTINGS = {}

if((process.env.ENV || '').toUpperCase() === 'PROD'){
    ENV_SETTINGS = require('./production');
}
else if((process.env.ENV || '').toUpperCase() === 'TEST'){
    ENV_SETTINGS = require('./testing');
}
else{
    ENV_SETTINGS = require('./development');
}
    
const COMMON_SETTINGS = {
    ROOT: path.resolve(__dirname, '..'),
};


const SETTINGS = { ...COMMON_SETTINGS, ...ENV_SETTINGS}

module.exports = SETTINGS
