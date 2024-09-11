const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  // Récupération du token d'authentification depuis les cookies
  const token = req.cookies.accessToken;

  // Si aucun token n'est trouvé, renvoyer une réponse indiquant que l'utilisateur n'est pas connecté
  if (!token) {
    return res.status(403).json({ error: "Utilisateur non connecté" });
  }

  try {
    // Vérification du token avec la clé secrète
    const validToken = verify(token, process.env.SECRET_KEY);
    req.utilisateur = validToken;  // Ajouter les informations du token à la requête pour une utilisation future
    
    // Si le token est valide, passer à l'étape suivante du middleware
    if (validToken) {
      return next();
    }
  } catch (err) {
    // En cas d'erreur de vérification, supprimer le cookie et renvoyer une réponse d'erreur
    res.clearCookie('accessToken', { path: '/' });
    return res.status(401).json({
      error: "Token expiré ou invalide. Veuillez vous reconnecter.",
      details: err.message  // Pour des informations plus détaillées sur l'erreur
    });
  }
};

module.exports = { validateToken };
