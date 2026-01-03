const knex = require("knex");
const config = require("../knexfile.js");

// Use the environment variable to determine which config to use (development, production, etc.)
// Defaults to 'development' if no environment is set
const environment = process.env.NODE_ENV || "development";
const configOptions = config[environment];

module.exports = knex(configOptions);

