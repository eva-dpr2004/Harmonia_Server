const Sequelize = require('sequelize');
const config = require('./config/config'); // Assure-toi du chemin correct

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  // Utilise l'URL de ClearDB pour la production
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Utilise la configuration locale pour le développement
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  });
}

module.exports = sequelize;
