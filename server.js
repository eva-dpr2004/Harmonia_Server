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
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server tourne sur le port 3001');
    });
});

