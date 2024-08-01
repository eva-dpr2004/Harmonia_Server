const express = require('express');
const router = express.Router();
const { ajoutActivite } = require('../controllers/Activities');

router.post('/ajoutActivite', ajoutActivite);

module.exports = router;