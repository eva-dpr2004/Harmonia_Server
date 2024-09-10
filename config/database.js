const Sequelize = require('sequelize');

// Obtenir l'URL de ClearDB à partir de la variable d'environnement sur Heroku
const databaseUrl = process.env.CLEARDB_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('CLEARDB_DATABASE_URL is not defined in the environment variables');
}

// Créer une instance Sequelize avec l'URL ClearDB
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Certains serveurs ClearDB nécessitent SSL
    },
  },
  logging: false, // Désactiver les logs de requêtes SQL
});

module.exports = sequelize;
