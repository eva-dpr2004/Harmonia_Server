const { Activites } = require('../models');

const ajoutActivite = async (req, res) => {
  const activities = req.body;

  try {
    const newActivities = await Promise.all(
      activities.map(async activity => {
        const { animalId, date, debutActivite, finActivite } = activity;
        return Activites.create({
          Id_Animal: animalId,
          Date: date,
          Debut_Activite: debutActivite,
          Fin_Activite: finActivite
        });
      })
    );

    res.status(201).json({ success: true, message: 'Activités créées avec succès', activities: newActivities });
  } catch (error) {
    console.error('Erreur lors de la création des activités:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
};

module.exports = { ajoutActivite };
