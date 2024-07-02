const express = require('express');
const router = express.Router();
const { Utilisateurs } = require("../models");

router.get("/", (req, res) => {
    res.json("hello world");
});

router.post("/", async (req, res) => {
    const user = req.body;
    try {
        const newUser = await Utilisateurs.create(user);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
