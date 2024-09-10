const { Sequelize } = require('sequelize');
const config = require('./config'); // Adjust path if needed

const env = process.env.NODE_ENV || 'development'; // Get environment (default to development)
const dbConfig = config[env]; // Get the correct environment config

let sequelize;

if (dbConfig.use_env_variable) {
  // In production, use the environment variable for database URL
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  // In development or test, use the provided config values
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

module.exports = sequelize;
