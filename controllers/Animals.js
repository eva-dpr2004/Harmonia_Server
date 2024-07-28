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

const updateAnimal = async (req, res) => {

} 

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
