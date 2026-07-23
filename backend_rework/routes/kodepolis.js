const express = require('express');
const router = express.Router();
const kodepoliController = require('../app/api/controllers/kodepolis');
/* router.get('/', movieController.getAll); */
router.post('/', kodepoliController.create);
/* router.get('/:movieId', movieController.getById);
router.put('/:movieId', movieController.updateById);
router.delete('/:movieId', movieController.deleteById); */
module.exports = router;