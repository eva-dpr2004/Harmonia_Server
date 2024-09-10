const { Sequelize } = require('sequelize');

// Configuration pour ClearDB via la variable d'environnement
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // Connexion sécurisée
    },
  },
});

module.exports = sequelize;
