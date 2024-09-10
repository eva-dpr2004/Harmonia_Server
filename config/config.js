module.exports = {
    "development": {
      "username": "root",
      "password": null,
      "database": "harmonia",
      "host": "localhost",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "use_env_variable": "CLEARDB_DATABASE_URL",
      "dialect": "mysql",
      "dialectOptions": {
        "ssl": {
          "rejectUnauthorized": false
        }
      }
    }
  };
  