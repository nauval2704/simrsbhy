const express = require('express');
const router = express.Router();
const satusehatAuthController = require('../../../app/api/controllers/satusehat/auth/auth');

router.get('/generate', satusehatAuthController.generateToken);

module.exports = router;