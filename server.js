const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());
// DB
const db = require('./models');

// ROUTERS
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

// PORT
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server tourne sur le port 3001');
    });
});
