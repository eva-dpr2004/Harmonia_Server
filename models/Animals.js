module.exports = (sequelize, DataTypes) => {
    const Animaux = sequelize.define("Animaux", {
      Id_animal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Nom: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      Date_De_Naissance: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Date_Adoption: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Espece: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      Race: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      Sexe: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Poids: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      Habitat: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    }, {
      tableName: 'Animaux',
      timestamps: false
    });
  
    return Animaux;
  };
  