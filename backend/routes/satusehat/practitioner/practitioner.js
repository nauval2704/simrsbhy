const express = require('express');
const router = express.Router();
const practitionerController = require('../../../app/api/controllers/satusehat/practitioner/practitioner');

router.post('/search/nik', practitionerController.searchByNik);
router.get('/list', practitionerController.listPractitioner);
router.post('/list/search', practitionerController.listPractitionerByTerm);

module.exports = router;