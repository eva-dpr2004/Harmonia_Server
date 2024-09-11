const { Utilisateurs } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const validator = require('validator');

// Inscription
const createUser = async (req, res) => {
  const { Nom, Email, Mot_De_Passe } = req.body;

  // Validation des entrées
  const sanitizedNom = validator.escape(Nom.trim());
  const sanitizedEmail = validator.normalizeEmail(Email.trim());

  if (
    !validator.isLength(sanitizedNom, { min: 3, max: 15 }) || 
    !/^[A-Za-zÀ-ÖØ-öø-ÿ0-9-_' ]*$/.test(sanitizedNom) || 
    sanitizedNom.replace(/\s/g, '').length < 3 || 
    sanitizedNom.replace(/\s/g, '').length > 100 || 
    !validator.isEmail(sanitizedEmail) || 
    !validator.isLength(sanitizedEmail, { max: 320 }) || 
    !validator.isLength(Mot_De_Passe, { min: 12, max: 255 }) || 
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`])\S{12,}$/.test(Mot_De_Passe)
  ) {
    return res.status(400).json({ error: "Données d'entrée invalides" });
  }

  try {
    // Vérification des doublons pour Nom et Email
    const existingUserByName = await Utilisateurs.findOne({ where: { Nom: sanitizedNom } });
    if (existingUserByName) {
      return res.status(400).json({ error: "Nom déjà pris" });
    }

    const existingUserByEmail = await Utilisateurs.findOne({ where: { Email: sanitizedEmail } });
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email déjà pris" });
    }

    // Hachage du mot de passe
    const hash = await bcrypt.hash(Mot_De_Passe, 10);

    // Création de l'utilisateur
    const newUser = await Utilisateurs.create({
      Nom: sanitizedNom,
      Email: sanitizedEmail,
      Mot_De_Passe: hash,
    });

    res.json({ success: true, message: "Utilisateur créé avec succès", user: newUser });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};

// Connexion
const failedAttempts = {}; 

const MAX_FAILED_ATTEMPTS = 3; 
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

const loginUser = async (req, res) => {
  const { NomOrEmail, Mot_De_Passe } = req.body;

  const sanitizedNomOrEmail = NomOrEmail.trim();
  const sanitizedMot_De_Passe = Mot_De_Passe.trim();
  
  if (!validator.isLength(sanitizedNomOrEmail, { min: 3 }) || !validator.isLength(sanitizedMot_De_Passe, { min: 12 })) {
    return res.status(400).json({ error: "Données d'entrée invalides" });
  }

  try {
    let utilisateur;

    if (validator.isEmail(sanitizedNomOrEmail)) {
      utilisateur = await Utilisateurs.findOne({ where: { Email: sanitizedNomOrEmail } });
    } else {
      utilisateur = await Utilisateurs.findOne({ where: { Nom: sanitizedNomOrEmail } });
    }

    if (!utilisateur) {
      handleFailedAttempt(sanitizedNomOrEmail);
      return res.status(404).json({ error: "Utilisateur non existant" });
    }

    if (isUserLocked(sanitizedNomOrEmail)) {
      const lockUntil = failedAttempts[sanitizedNomOrEmail].lockUntil;
      const lockTimeLeft = Math.round((lockUntil - Date.now()) / 1000);
      return res.status(403).json({ error: `Compte verrouillé. Réessayez dans ${lockTimeLeft} secondes.` });
    }

    const match = await bcrypt.compare(sanitizedMot_De_Passe, utilisateur.Mot_De_Passe);
    if (!match) {
      handleFailedAttempt(sanitizedNomOrEmail);
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    resetFailedAttempts(sanitizedNomOrEmail);

    const accessToken = sign(
      { Nom: utilisateur.Nom, Id_Utilisateur: utilisateur.Id_Utilisateur }, 
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATIONS }
    );

    // Set cookie with Secure flag
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite : "None",
      maxAge: 60 * 60 * 1000 // 1 heure
    });

    res.json({ success: true, message: "Connexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};

// Gestion des tentatives échouées
function handleFailedAttempt(NomOrEmail) {
  if (!failedAttempts[NomOrEmail]) {
    failedAttempts[NomOrEmail] = { attempts: 0, lockUntil: null };
  }

  failedAttempts[NomOrEmail].attempts += 1;

  if (failedAttempts[NomOrEmail].attempts >= MAX_FAILED_ATTEMPTS) {
    failedAttempts[NomOrEmail].lockUntil = Date.now() + LOCK_TIME;
  }
}

function isUserLocked(NomOrEmail) {
  return failedAttempts[NomOrEmail] && failedAttempts[NomOrEmail].lockUntil > Date.now();
}

function resetFailedAttempts(NomOrEmail) {
  if (failedAttempts[NomOrEmail]) {
    failedAttempts[NomOrEmail] = { attempts: 0, lockUntil: null };
  }
}

// Déconnexion
const logoutUser = async (req, res) => {
  res.clearCookie('accessToken');
  res.json({ success: true, message: 'Déconnexion réussie' });
};

// Récupération de l'utilisateur connecté
const getAuthenticatedUser = async (req, res) => {
  res.json(req.utilisateur);
};

// Récupération d'informations basiques sur un utilisateur
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

// Mise à jour des informations de l'utilisateur
const updateUser = async (req, res) => {
  const Id_Utilisateur = req.params.id;
  const { Nom, Email, Mot_De_Passe } = req.body;

  try {
    const utilisateur = await Utilisateurs.findByPk(Id_Utilisateur);
    if (!utilisateur) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    let sanitizedNom = Nom ? validator.escape(Nom.trim()) : null;
    let sanitizedEmail = Email ? validator.normalizeEmail(Email.trim()) : null;

    if (sanitizedNom && !validator.isLength(sanitizedNom, { min: 3, max: 15 })) {
      return res.status(400).json({ error: "Le nom doit contenir entre 3 et 15 caractères" });
    }

    if (sanitizedEmail && !validator.isEmail(sanitizedEmail)) {
      return res.status(400).json({ error: "L'email est invalide" });
    }

    if (Mot_De_Passe) {
      utilisateur.Mot_De_Passe = await bcrypt.hash(Mot_De_Passe, 10);
    }

    if (sanitizedNom) utilisateur.Nom = sanitizedNom;
    if (sanitizedEmail) utilisateur.Email = sanitizedEmail;

    await utilisateur.save();

    res.json({ success: true, message: "Utilisateur mis à jour avec succès", utilisateur });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};

// Suppression d'un utilisateur
const deleteUser = async (req, res) => {
  const Id_Utilisateur = req.params.id;

  try {
    const utilisateur = await Utilisateurs.findByPk(Id_Utilisateur);
    if (!utilisateur) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await utilisateur.destroy();
    res.json({ success: true, message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};

module.exports = { createUser, loginUser, logoutUser, getAuthenticatedUser, getBasicInfo, updateUser, deleteUser };
