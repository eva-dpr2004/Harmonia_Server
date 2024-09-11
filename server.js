const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database'); // Importer la configuration de la base de données
const session = require('express-session'); // Importer express-session pour gérer les sessions

dotenv.config(); // Charger les variables d'environnement

const app = express();
app.disable('x-powered-by');

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configuration CORS
app.use(cors({
  origin: 'https://harmonia-client-git-test-eva-dprs-projects.vercel.app', // URL du frontend déployé
  credentials: true, // Autoriser les cookies et les headers d'authentification
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Gestion des sessions avec les cookies sécurisés
app.use(session({
  secret: process.env.SECRET_KEY || 'votreCleSecreteIci', // Utilisez une clé secrète sécurisée
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, // Utilisez 'https' pour les cookies sécurisés
    httpOnly: true, // Les cookies ne sont pas accessibles via JavaScript
    sameSite: 'None' // Nécessaire pour les cookies cross-site entre Vercel et Heroku
  }
}));

// ROUTES
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const animalsRouter = require("./routes/Animals");
app.use("/animals", animalsRouter);

const activitiesRouter = require("./routes/Activities");
app.use("/activities", activitiesRouter);

// Test route
app.get("/", (req, res) => {
  return res.send("Hello, welcome to Harmonia!");
});

// PORT
const PORT = process.env.PORT || 3000;

// Synchroniser la base de données et démarrer le serveur
db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
