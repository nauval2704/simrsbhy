const express = require('express');
const router = express.Router();
const operasiController = require('../app/api/controllers/operasi');
/* router.get('/', movieController.getAll); */
router.post('/', operasiController.create);
router.post('/kodeBooking/', operasiController.getById);
router.post('/list/', operasiController.getByTgl);
/* router.get('/:movieId', movieController.getById);
router.put('/:movieId', movieController.updateById);
router.delete('/:movieId', movieController.deleteById); */


module.exports = router;