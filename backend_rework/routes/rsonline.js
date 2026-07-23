const express = require("express");
const router = express.Router();
const simrsController = require("../app/api/controllers/rsonline");
router.get("/referensi/tempat_tidur", simrsController.refTempatTidur);
router.get("/fasyankes", simrsController.fasyankes);
router.get("/fasyankes/update", simrsController.ufasyankes);
module.exports = router;


