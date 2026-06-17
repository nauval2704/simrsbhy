const express = require('express');
const router = express.Router();
const patiennController = require('../../../app/api/controllers/satusehat/patient/patient');

router.post('/search/nik', patiennController.searchByNik);

module.exports = router;