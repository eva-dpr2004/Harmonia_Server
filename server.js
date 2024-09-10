const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// DB
const db = require('./models');

// ROUTERS
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const animalsRouter = require("./routes/Animals");
app.use("/animals", animalsRouter);

const activitiesRouter = require("./routes/Activities");
app.use("/activities", activitiesRouter);

// PORT
db.sequelize.sync({ alter: false }).then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log('Server is running on port 3001');
    });
});
