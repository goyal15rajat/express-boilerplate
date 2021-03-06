const express = require("express");
const app = express.Router();

// Request Handlers
const { version } = require("./handlers/version");

// Routes
app.get("/_version", version);

module.exports = app;