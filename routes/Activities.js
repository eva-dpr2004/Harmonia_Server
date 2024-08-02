const express = require('express');
const router = express.Router();
const { ajoutActivite, getActivitesByUserId } = require('../controllers/Activities');

router.post('/ajoutActivite', ajoutActivite);

router.get('/getActivitesByUserId/:userId', getActivitesByUserId);

module.exports = router;