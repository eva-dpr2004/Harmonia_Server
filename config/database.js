const { Sequelize } = require('sequelize');
require('dotenv').config(); // Assurez-vous que les variables d'environnement sont chargées

// Configuration pour différents environnements
const dbConfig = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'database_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'CLEARDB_DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false // Connexion sécurisée pour ClearDB
      }
    }
  }
};

const env = process.env.NODE_ENV || 'development';
let sequelize;

if (dbConfig[env].use_env_variable) {
  // Utilisation de ClearDB en production
  sequelize = new Sequelize(process.env[dbConfig[env].use_env_variable], {
    dialect: dbConfig[env].dialect,
    dialectOptions: dbConfig[env].dialectOptions
  });
} else {
  // Utilisation de la configuration locale en développement
  sequelize = new Sequelize(dbConfig[env].database, dbConfig[env].username, dbConfig[env].password, {
    host: dbConfig[env].host,
    dialect: dbConfig[env].dialect
  });
}

module.exports = sequelize;
