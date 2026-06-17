const express = require('express');
const router = express.Router();
const antreanController = require('../app/api/controllers/antreans');
/* router.get('/', movieController.getAll); */
router.post('/', antreanController.create);
router.post('/rekap/', antreanController.getByTgl);
router.post('/getAll', antreanController.getAll);
router.post('/display', antreanController.display);
/* router.get('/:movieId', movieController.getById);
router.put('/:movieId', movieController.updateById);
router.delete('/:movieId', movieController.deleteById); */
module.exports = router;