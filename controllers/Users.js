const { Utilisateurs } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken');

//Inscription
const createUser = async (req, res) => {
  const { Nom, Email, Mot_De_Passe } = req.body;
  try {
      // Vérifier si le Nom existe déjà
      const existingUserByName = await Utilisateurs.findOne({ where: { Nom } });
      if (existingUserByName) {
          return res.status(400).json({ error: "Nom déjà pris" });
      }

      // Vérifier si l'Email existe déjà
      const existingUserByEmail = await Utilisateurs.findOne({ where: { Email } });
      if (existingUserByEmail) {
          return res.status(400).json({ error: "Email déjà pris" });
      }

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
const failedAttempts = {}; // Suivi des tentatives d'auth

const MAX_FAILED_ATTEMPTS = [3, 4, 5];
const LOCK_TIME = [5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000]; // 5, 15, 30 min


const loginUser = async (req, res) => {
  const { Nom, Mot_De_Passe } = req.body;

  try {
    const utilisateur = await Utilisateurs.findOne({ where: { Nom } });

    if (!utilisateur) {
      handleFailedAttempt(Nom);
      return res.json({ error: "Utilisateur non existant" });
    }

    if (isUserLocked(Nom)) {
      const lockUntil = failedAttempts[Nom].lockUntil;
      const lockTimeLeft = Math.round((lockUntil - Date.now()) / 1000); // in seconds
      return res.status(403).json({ error: `Compte verrouillé. Réessayez dans ${lockTimeLeft} secondes.` });
    }

    const match = await bcrypt.compare(Mot_De_Passe, utilisateur.Mot_De_Passe);
    if (!match) {
      handleFailedAttempt(Nom);
      return res.json({ error: "Mot de passe ou nom incorrect" });
    }

    resetFailedAttempts(Nom);
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

function handleFailedAttempt(Nom) {
  if (!failedAttempts[Nom]) {
    failedAttempts[Nom] = { attempts: 0, lockUntil: null };
  }
  failedAttempts[Nom].attempts += 1;

  const attempts = failedAttempts[Nom].attempts;
  if (attempts === MAX_FAILED_ATTEMPTS[0]) {
    failedAttempts[Nom].lockUntil = Date.now() + LOCK_TIME[0];
  } else if (attempts === MAX_FAILED_ATTEMPTS[1]) {
    failedAttempts[Nom].lockUntil = Date.now() + LOCK_TIME[1];
  } else if (attempts >= MAX_FAILED_ATTEMPTS[2]) {
    failedAttempts[Nom].lockUntil = Date.now() + LOCK_TIME[2];
  }
}

function isUserLocked(Nom) {
  if (failedAttempts[Nom] && failedAttempts[Nom].lockUntil > Date.now()) {
    return true;
  }
  return false;
}

function resetFailedAttempts(Nom) {
  if (failedAttempts[Nom]) {
    failedAttempts[Nom] = { attempts: 0, lockUntil: null };
  }
}

//Déconnexion
const logoutUser = async (req, res) => {
  res.clearCookie('accessToken');
  console.log('Cookie cleared');
  res.json({ success: true, message: 'Déconnexion réussie' });
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

module.exports = { createUser, loginUser, logoutUser, getAuthenticatedUser, getBasicInfo, updateUser, deleteUser};