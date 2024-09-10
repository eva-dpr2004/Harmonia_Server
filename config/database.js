const Sequelize = require('sequelize');

// Utiliser les variables d'environnement pour la connexion
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Nécessaire pour ClearDB
    },
  },
});

module.exports = sequelize;
