const path = require("path");
var ENV_SETTINGS = {};

if(process.env.ENV && process.env.ENV.toUpperCase() === "PROD"){
    ENV_SETTINGS = require("./production");
}
else if(process.env.ENV && process.env.ENV.toUpperCase() === "TEST"){
    ENV_SETTINGS = require("./testing");
}
else{
    ENV_SETTINGS = require("./development");
}

const COMMON_SETTINGS = {
    ROOT: path.resolve(__dirname, ".."),
    ENV: (process.env.ENV || "PROD").toUpperCase(),
    CUSTOMER_CODE: (process.env.CUSTOMER_CODE || "").toUpperCase(),
    ENV_CODE: process.env.ENV_CODE,
    SERVICE_NAME: (process.env.SERVICE_NAME || "boilerplate").toUpperCase()
};


const SETTINGS = { ...COMMON_SETTINGS, ...ENV_SETTINGS };

module.exports = SETTINGS;
