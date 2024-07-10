const express = require('express');
const router = express.Router();
const {createUser, loginUser, getAuthenticatedUser, getBasicInfo, updateUser, deleteUser} = require("../controllers/Users");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/", createUser);

router.post("/login", loginUser);

router.get('/auth', validateToken, getAuthenticatedUser)

router.get("/basicinfo/:id", getBasicInfo);

router.put("/updateuser/:id", updateUser);

router.delete("/deleteuser/:id", deleteUser);


module.exports = router;