const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

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
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server tourne sur le port 3001');
    });
});




// const express = require('express');
// const cookieParser = require('cookie-parser');
// const app = express();
// const cors = require('cors');

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// // DB
// const db = require('./models');

// // ROUTERS
// const usersRouter = require("./routes/Users");
// app.use("/auth", usersRouter);

// const animalsRouter = require("./routes/Animals");
// app.use("/animals", animalsRouter);

// const activitiesRouter = require("./routes/Activities");
// app.use("/activities", activitiesRouter);

// // PORT
// db.sequelize.sync().then(() => {
//     app.listen(3001, () => {
//         console.log('Server tourne sur le port 3001');
//     });
// });


// const express = require('express');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const app = express();

// app.use(cookieParser());

// // Configuration CORS pour autoriser le frontend sur localhost:3000
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });


//   app.options('*', cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

//   app.use(express.json());

// // DB
// const db = require('./models');

// // ROUTERS
// const usersRouter = require("./routes/Users");
// app.use("/auth", usersRouter);

// const animalsRouter = require("./routes/Animals");
// app.use("/animals", animalsRouter);

// const activitiesRouter = require("./routes/Activities");
// app.use("/activities", activitiesRouter);

// // PORT
// db.sequelize.sync().then(() => {
//     app.listen(3001, () => {
//         console.log('Server tourne sur le port 3001');
//     });
// });
