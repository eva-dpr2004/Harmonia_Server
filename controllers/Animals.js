const { Animaux } = require('../models');

const formatDate = (date) => {
    const parts = date.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`; 
};

// Validation de la format de la date
const isValidDate = (date) => {
    return /^\d{2}-\d{2}-\d{4}$/.test(date);
};

const createAnimal = async (req, res) => {
    const { Nom, Date_De_Naissance, Date_Adoption, Espece, Race, Sexe, Habitat } = req.body;

    if (!isValidDate(Date_De_Naissance) || !isValidDate(Date_Adoption)) {
        return res.status(400).json({ error: "Format de date invalide" });
    }

    try {
        const newAnimal = await Animaux.create({
            Nom,
            Date_De_Naissance: formatDate(Date_De_Naissance),
            Date_Adoption: formatDate(Date_Adoption),
            Espece,
            Race,
            Sexe,
            Habitat
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
