const express = require('express');
const router = express.Router();
const { createAnimal, getAnimalByUserId } = require('../controllers/Animals');

router.post('/ajoutAnimal', createAnimal);

router.get('/byUserId/:id', getAnimalByUserId);

module.exports = router;