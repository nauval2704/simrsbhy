const express = require("express");
const router = express.Router();
const keuanganPasienController = require("../../app/api/controllers/keuangan/pasien");
const keuanganJasaDokterController = require("../../app/api/controllers/keuangan/jasaDokter");

router.post("/pasien", keuanganPasienController.pasien);

router.post("/jasa/dokter", keuanganJasaDokterController.create);
router.get("/jasa/dokter", keuanganJasaDokterController.getJasaDokter);

module.exports = router;