module.exports = {
  development: {
    username: "root",
    password: null,
    database: "harmonia",
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    use_env_variable: "CLEARDB_DATABASE_URL",
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false // Nécessaire pour ClearDB SSL
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
