const Sequelize = require('sequelize');
//const config = require('./config/config'); // Chemin du fichier de configuration

const env = process.env.NODE_ENV || 'development'; // Détermine l'environnement (production, development, test)
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  // Utilisation de ClearDB en production
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false // Connexion sécurisée à ClearDB
      }
    }
  });
} else {
  // Utilisation de la configuration locale en développement/test
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  });
}

module.exports = sequelize;
