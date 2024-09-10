const { Sequelize } = require('sequelize');

// Utilisation de l'URL ClearDB dans l'environnement de production
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Connexion sécurisée à ClearDB
    },
  },
});

module.exports = sequelize;
