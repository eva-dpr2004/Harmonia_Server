const { Utilisateurs } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken');
const { Op } = require('sequelize'); 

const createUser = async (req, res) => {
    const { Nom, Email, Mot_De_Passe } = req.body;
    try {
        const hash = await bcrypt.hash(Mot_De_Passe, 10);
        const newUser = await Utilisateurs.create({
            Nom,
            Email,
            Mot_De_Passe: hash,
        });
        res.json({ success: true, message: "Utilisateur créé avec succès", user: newUser });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};

const loginUser = async (req, res) => {
    const { identifier, Mot_De_Passe } = req.body;
    try {
        const utilisateur = await Utilisateurs.findOne({ 
            where: { 
                [Op.or]: [{ Nom: identifier }, { Email: identifier }] 
            } 
        });

        if (!utilisateur) {
            return res.status(404).json({ error: "Utilisateur non existant" });
        }

        if (!Mot_De_Passe || !utilisateur.Mot_De_Passe) {
            return res.status(400).json({ error: "Mot de passe non fourni ou incorrect" });
        }

        const match = await bcrypt.compare(Mot_De_Passe, utilisateur.Mot_De_Passe);
        if (!match) {
            return res.status(401).json({ error: "Nom/email ou Mot de passe incorrect" });
        }

        const accessToken = sign(
            { Nom: utilisateur.Nom, Id_Utilisateur: utilisateur.Id_Utilisateur },
            "secretpassword"
        );

        res.json({ success: true, token: accessToken });
    } catch (error) {
        console.error("Erreur lors de la tentative de connexion :", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};

async function getAuthenticatedUser(req, res) {
    res.json(req.Utilisateurs);
  }

module.exports = { createUser, loginUser, getAuthenticatedUser};
