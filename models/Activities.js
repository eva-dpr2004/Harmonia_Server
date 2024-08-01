module.exports = (sequelize, DataTypes) => {
    const Activites = sequelize.define("Activites", {
      Id_Activite: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Id_Animal: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      Debut_Activite: {
        type: DataTypes.TIME,
        allowNull: false
      },
      Fin_Activite: {
        type: DataTypes.TIME,
        allowNull: false
      },
      Duree_Activite: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'Activites',
      timestamps: false,
      hooks: {
        beforeSave: (activite, options) => {
          const debut = activite.Debut_Activite;
          const fin = activite.Fin_Activite;
          const debutDate = new Date(`1970-01-01T${debut}Z`);
          const finDate = new Date(`1970-01-01T${fin}Z`);
          const diffMs = finDate - debutDate;
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          activite.Duree_Activite = `${diffHrs}h ${diffMins}min`;
        }
      }
    });
  
    Activites.associate = (models) => {
      Activites.belongsTo(models.Animaux, {
        foreignKey: 'Id_Animal',
        onDelete: 'CASCADE'
      });
    };
  
    return Activites;
  };
  