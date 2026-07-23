const express = require('express');
const router = express.Router();
const diagnosisController = require('../../../app/api/controllers/satusehat/condition/diagnosis');
const conditionController = require('../../../app/api/controllers/satusehat/condition/condition');

router.post('/diagnosis/create', diagnosisController.create);
router.post('/detail', conditionController.detail);

module.exports = router;