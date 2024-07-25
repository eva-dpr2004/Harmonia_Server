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

module.exports = {
    createAnimal
};
