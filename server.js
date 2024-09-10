const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://harmonia-client-git-test-eva-dprs-projects.vercel.app/', credentials: true }));

// DB
const db = require('./models');

// ROUTERS
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const animalsRouter = require("./routes/Animals");
app.use("/animals", animalsRouter);

const activitiesRouter = require("./routes/Activities");
app.use("/activities", activitiesRouter);

app.get("/", (req, res) => {
    return res.send("bonzour ze zuis quentin");
});

// PORT
const PORT = process.env.PORT || 3001;  // Utilise le port fourni par Heroku ou 3001 en local
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server tourne sur le port ${PORT}`);
    });
});


