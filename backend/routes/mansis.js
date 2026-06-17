const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/mansis');
router.get('', userController.getApp);

module.exports = router;