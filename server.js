const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); // Charger les variables d'environnement

const app = express();
app.disable('x-powered-by');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://harmonia-client-git-test-eva-dprs-projects.vercel.app', credentials: true }));

// Importer la configuration de la base de données
const db = require('./config/database'); // Connexion à la base de données

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
const PORT = process.env.PORT || 3001;

// Synchroniser la base de données et démarrer le serveur
db.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});
