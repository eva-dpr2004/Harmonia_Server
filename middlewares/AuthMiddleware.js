const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  
  if (!token) return res.json({ error: "Utilisateur non connecté" });

  try {
    const validToken = verify(token, process.env.SECRET_KEY); 
    req.utilisateur = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    res.clearCookie('accessToken');
    return res.status(401).json({ error: "Token expiré ou invalide. Veuillez vous reconnecter.", details: err.message });
  }
};

module.exports = { validateToken };
