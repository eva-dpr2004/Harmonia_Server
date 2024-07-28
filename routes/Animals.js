const express = require('express');
const router = express.Router();
const { createAnimal, getAnimalByUserId, updateAnimal, deleteAnimal } = require('../controllers/Animals');

router.post('/ajoutAnimal', createAnimal);

router.get('/byUserId/:id', getAnimalByUserId);

router.put("/updateAnimal/:id", updateAnimal);

router.delete("/deleteAnimal/:id" , deleteAnimal);

module.exports = router;