const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database'); // Importer la configuration de la base de données

dotenv.config(); // Charger les variables d'environnement

const app = express();
app.disable('x-powered-by');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://harmonia-client-git-test-eva-dprs-projects.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
db.sync({ alter: true }) // Utilisez force: true pour forcer la recréation des tables (perdra les données)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });