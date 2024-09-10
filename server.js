const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); // Charger les variables d'environnement

const app = express();

// Désactiver l'en-tête 'X-Powered-By'
app.disable('x-powered-by');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configurer CORS pour votre client déployé sur Vercel
app.use(cors({ 
    origin: 'https://harmonia-client-git-test-eva-dprs-projects.vercel.app', 
    credentials: true 
}));

// DB (Utilisation de la configuration ClearDB via Sequelize)
const db = require('./config/database'); // Supposons que votre config Sequelize soit dans './config/database.js'

// ROUTERS
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const animalsRouter = require("./routes/Animals");
app.use("/animals", animalsRouter);

const activitiesRouter = require("./routes/Activities");
app.use("/activities", activitiesRouter);

// Test route
app.get("/", (req, res) => {
    return res.send("bonzour ze zuis quentin");
});

// PORT
const PORT = process.env.PORT || 3001;  // Utilise le port fourni par Heroku ou 3001 en local

// Synchroniser la base de données et démarrer le serveur
db.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server tourne sur le port ${PORT}`);
    });
}).catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
});
