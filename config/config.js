require('dotenv').config(); // Load environment variables from .env

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "harmonia",
    "host": process.env.DB_HOST || "localhost",
    "dialect": process.env.DB_DIALECT || "mysql"
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_test",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": process.env.DB_DIALECT || "mysql"
  },
  "production": {
    "use_env_variable": "CLEARDB_DATABASE_URL", // Use ClearDB connection URL
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false // For secure connection to ClearDB
      }
    }
  }
};
