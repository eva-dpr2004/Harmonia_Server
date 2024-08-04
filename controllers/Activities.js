const { Op } = require('sequelize'); 
const { Activites, Animaux } = require('../models');

const ajoutActivite = async (req, res) => {
  const { animalId, date, debutActivite, finActivite } = req.body;

  const debutDate = new Date(`1970-01-01T${debutActivite}Z`);
  let finDate = new Date(`1970-01-01T${finActivite}Z`);
  
  if (finDate < debutDate) {
    finDate.setDate(finDate.getDate() + 1);
  }

  const diffMs = finDate - debutDate;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const dureeActivite = `${diffHrs}h ${diffMins}min`;

  try {
    const animal = await Animaux.findOne({ where: { Id_Animal: animalId } });
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    const activitiesCount = await Activites.count({
      where: {
        Id_Animal: animalId,
        Date: date
      }
    });

    const maxActivitiesPerDay = 10; 

    if (activitiesCount >= maxActivitiesPerDay) {
      return res.status(400).json({ error: `Limite d'activités atteinte pour cet animal aujourd'hui.` });
    }

    const newActivity = await Activites.create({
      Id_Animal: animalId,
      Nom_Animal: animal.Nom, // Inclure le nom de l'animal
      Date: date,
      Debut_Activite: debutActivite,
      Fin_Activite: finActivite,
      Duree_Activite: dureeActivite
    });

    res.status(201).json({ success: true, message: 'Activité créée avec succès', activity: newActivity });
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
};

const getActivitesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const activites = await Activites.findAll({
      include: [{
        model: Animaux,
        where: { Id_Utilisateur: userId },
        required: true
      }]
    });

    res.status(200).json(activites);
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
};

const deleteActivitiesById = async (req, res) => {
  const { activitiesId } = req.params;
  console.log(`Reçu une demande de suppression pour l'activité ID: ${activitiesId}`);

  try {
    const activity = await Activites.findByPk(activitiesId);
    if (!activity) {
      console.log('Activité non trouvée');
      return res.status(404).json({ error: "Activité non trouvée" });
    }

    await activity.destroy();
    console.log('Activité supprimée avec succès');
    res.status(200).json({ success: true, message: 'Activité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
};

module.exports = { ajoutActivite, getActivitesByUserId, deleteActivitiesById };