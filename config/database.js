const Sequelize = require('sequelize');

// Utiliser la variable d'environnement CLEARDB_DATABASE_URL fournie par Heroku
const databaseUrl = process.env.CLEARDB_DATABASE_URL || process.env.CLEARDB_DATABASE;

if (!databaseUrl) {
    throw new Error('CLEARDB_DATABASE_URL or CLEARDB_DATABASE is not defined in the environment variables');
}

// Créer une instance Sequelize avec l'URL ClearDB
const sequelize = new Sequelize(databaseUrl, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false // Certains serveurs ClearDB nécessitent SSL
        },
    },
    logging: false, // Optionnel : désactiver les logs SQL
});

module.exports = sequelize;
