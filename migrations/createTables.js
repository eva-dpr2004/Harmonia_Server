'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Création de la table `utilisateurs`
    await queryInterface.createTable('utilisateurs', {
      Id_Utilisateur: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nom: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      Mot_De_Passe: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Role: {
        type: Sequelize.STRING(25),
        allowNull: true
      }
    });

    // Création de la table `animaux`
    await queryInterface.createTable('animaux', {
      Id_Animal: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nom: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Date_De_Naissance: {
        type: Sequelize.DATE,
        allowNull: true
      },
      Date_Adoption: {
        type: Sequelize.DATE,
        allowNull: true
      },
      Espece: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Race: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      Sexe: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      Poids: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      Habitat: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      Id_Utilisateur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'utilisateurs', // Association avec la table utilisateurs
          key: 'Id_Utilisateur'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      photoURL: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    });

    // Création de la table `activites`
    await queryInterface.createTable('activites', {
      Id_Activite: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Id_Animal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'animaux', // Association avec la table animaux
          key: 'Id_Animal'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      Nom_Animal: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Debut_Activite: {
        type: Sequelize.TIME,
        allowNull: false
      },
      Fin_Activite: {
        type: Sequelize.TIME,
        allowNull: false
      },
      Duree_Activite: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Suppression des tables dans l'ordre inverse pour respecter les contraintes de clés étrangères
    await queryInterface.dropTable('activites');
    await queryInterface.dropTable('animaux');
    await queryInterface.dropTable('utilisateurs');
  }
};
