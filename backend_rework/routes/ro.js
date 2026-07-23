const express = require("express");
const router = express.Router();
const roController = require("../app/api/controllers/ro");

router.get("/pasien/norm/:nik/tglLahir/:tglLahir", roController.pasien);
router.post("/register", roController.register);
router.get("/list", roController.list);
// router.post("/getAll", roController.getAll);

module.exports = router;
