const Sequelize = require('sequelize');

// Utiliser la variable d'environnement CLEARDB_DATABASE_URL sur Heroku
const databaseUrl = process.env.CLEARDB_DATABASE_URL || 'mysql://username:password@localhost:3306/mydatabase';

// Configurer Sequelize avec l'URL de ClearDB
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false // Nécessaire pour ClearDB
    }
  },
  logging: false // Optionnel : désactiver les logs SQL
});

module.exports = sequelize;
