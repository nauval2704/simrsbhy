const express = require('express');
const router = express.Router();
const locationController = require('../../../app/api/controllers/satusehat/location/location');

router.post('/create', locationController.create);

module.exports = router;