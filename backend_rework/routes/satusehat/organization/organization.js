const express = require('express');
const router = express.Router();
const organizationController = require('../../../app/api/controllers/satusehat/organization/organization');

router.post('/create', organizationController.create);
router.get('/search/partof', organizationController.searchByPartOf);

module.exports = router;