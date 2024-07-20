const express = require('express');
const router = express.Router();
const { createAnimal } = require('../controllers/Animals');

router.post('/animals', createAnimal);

module.exports = router;