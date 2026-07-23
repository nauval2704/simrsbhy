const express = require('express');
const router = express.Router();
const encounterController = require('../../../app/api/controllers/satusehat/encounter/encounter');

router.post('/create', encounterController.create);
router.post('/detail', encounterController.detail);
router.post('/updatetriase', encounterController.updateTriase);
router.post('/updatefinished', encounterController.updateFinished);

module.exports = router;