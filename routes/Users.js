const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const {createUser, loginUser, getAuthenticatedUser } = require("../controllers/Users");

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/auth", validateToken, getAuthenticatedUser);

module.exports = router;
