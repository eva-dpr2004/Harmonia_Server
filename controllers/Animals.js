const { Animaux } = require('../models');
const jwt = require('jsonwebtoken');

const createAnimal = async (req, res) => {
    const { Nom, Date_De_Naissance, Date_Adoption, Espece, Race, Sexe, Poids, Habitat, photoURL } = req.body;
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    try {
        const decoded = jwt.verify(token, 'importantsecret');
        const Id_Utilisateur = decoded.Id_Utilisateur;

        const animalCount = await Animaux.count({
            where: { Id_Utilisateur: Id_Utilisateur }
        });

        if (animalCount >= 50) {
            return res.status(400).json({ error: "Vous ne pouvez pas ajouter plus de 50 animaux." });
        }

        const newAnimal = await Animaux.create({
            Nom,
            Date_De_Naissance,
            Date_Adoption,
            Espece,
            Race,
            Sexe,
            Poids,
            Habitat,
            Id_Utilisateur,
            photoURL
        });

        res.status(201).json({ success: true, message: "Animal créé avec succès", animal: newAnimal });
    } catch (error) {
        console.error("Erreur lors de la création de l'animal:", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};

const getAnimalByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const animaux = await Animaux.findAll({ where: { Id_Utilisateur: id } });
        res.status(200).json(animaux);
    } catch (error) {
        console.error("Erreur lors de la récupération des animaux:", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};

let modificationsTracker = {};

const updateAnimal = async (req, res) => {
    const { id } = req.params;
    const { Nom, Date_De_Naissance, Date_Adoption, Espece, Race, Sexe, Poids, Habitat } = req.body;
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    try {
        const decoded = jwt.verify(token, 'importantsecret');
        const Id_Utilisateur = decoded.Id_Utilisateur;

        const animal = await Animaux.findOne({
            where: {
                Id_Animal: id,
                Id_Utilisateur: Id_Utilisateur
            }
        });

        if (!animal) {
            return res.status(404).json({ error: "Animal non trouvé" });
        }

        const today = new Date().toISOString().split('T')[0]; // Date actuelle sans l'heure
        const key = `${id}-${today}`; // Clé unique pour l'animal et la date

        // Initialiser le compteur de modifications pour l'animal s'il n'existe pas
        if (!modificationsTracker[key]) {
            modificationsTracker[key] = 0;
        }

        // Vérifier si l'animal a déjà été modifié 3 fois aujourd'hui
        if (modificationsTracker[key] >= 3) {
            return res.status(400).json({ error: "Vous ne pouvez pas modifier les informations d'un animal plus de 3 fois par jour." });
        }

        // Incrémenter le compteur de modifications
        modificationsTracker[key] += 1;

        await animal.update(
            { Nom, Date_De_Naissance, Date_Adoption, Espece, Race, Sexe, Poids, Habitat }
        );

        const updatedAnimal = await Animaux.findOne({ where: { Id_Animal: id } });

        res.status(200).json({ success: true, message: "Animal mis à jour avec succès", animal: updatedAnimal });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'animal:", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};


const deleteAnimal = async (req, res) => {
    const { id } = req.params;
    try {
        await Animaux.destroy({ where: { Id_Animal: id } });
        res.status(200).json({ success: true, message: "Animal supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'animal:", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};

module.exports = { createAnimal, getAnimalByUserId, updateAnimal, deleteAnimal };
