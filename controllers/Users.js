const { Utilisateurs } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken');

//Inscription
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

//Connexion
const loginUser = async (req, res) => {
  const { Nom, Mot_De_Passe } = req.body;

  try {
    const utilisateur = await Utilisateurs.findOne({ where: { Nom } });

    if (!utilisateur) {
      return res.json({ error: "Utilisateur non existant" });
    }

    const match = await bcrypt.compare(Mot_De_Passe, utilisateur.Mot_De_Passe);
    if (!match) {
      return res.json({ error: "Mot de passe ou nom incorrect" });
    }

    const accessToken = sign(
      { Nom: utilisateur.Nom, Id_Utilisateur: utilisateur.Id_Utilisateur }, 
      "importantsecret"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ success: true });
  } catch (error) {
    res.json({ error: "Erreur lors de la connexion" });
  }
};

//Récupération de l'Utilisateur connecté
const getAuthenticatedUser = async (req, res) =>{
  res.json(req.utilisateur);
}

//Récupération Utilisateur
const getBasicInfo = async (req, res) => {
    const Id_Utilisateur = req.params.id;
  
    try {
      const utilisateur = await Utilisateurs.findByPk(Id_Utilisateur, {
        attributes: ['Id_Utilisateur', 'Nom', 'Email', 'Mot_De_Passe']
      });
  
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      res.json(utilisateur);
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  };

//Modifier Utilisateur
const updateUser = async (req, res) => {
    const Id_Utilisateur = req.params.id;  
    const { Nom, Email, Mot_De_Passe } = req.body;

    try {
        const utilisateur = await Utilisateurs.findByPk(Id_Utilisateur);
        if (!utilisateur) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Hashage du nouveau mot de passe s'il est fourni
        if (Mot_De_Passe) {
            utilisateur.Mot_De_Passe = await bcrypt.hash(Mot_De_Passe, 10);
        }

        // Mise à jour des champs nom et email s'ils sont fournis
        if (Nom) utilisateur.Nom = Nom;
        if (Email) utilisateur.Email = Email;
        
        await utilisateur.save();

        res.json({ success: true, message: "Utilisateur mis à jour avec succès", utilisateur });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
    }
};

//Supprimer Utilisateur
const deleteUser = async (req, res) => {
  const Id_Utilisateur = req.params.id;  // Récupérer l'ID de l'URL

  try {
      const utilisateur = await Utilisateurs.findByPk(Id_Utilisateur);
      if (!utilisateur) {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      await utilisateur.destroy();  // Supprimer l'utilisateur trouvé
      res.json({ success: true, message: "Utilisateur supprimé avec succès" });
  } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};

module.exports = { createUser, loginUser, getAuthenticatedUser, getBasicInfo, updateUser, deleteUser};