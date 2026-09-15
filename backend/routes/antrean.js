const express = require("express");
const router = express.Router();
const antreanController = require("../app/api/controllers/antrean");

router.post("/statusAntrean", antreanController.statusAntrean);
router.post("/ambilAntrean", antreanController.ambilAntrean2);
router.post("/ambilAntreanlimit", antreanController.ambilantreanlimit);
router.post("/sisaAntrean", antreanController.sisaAntrean);
router.post("/batalAntrean", antreanController.batalAntrean);
router.post("/checkIn", antreanController.checkIn);
router.post("/pasienBaru", antreanController.pasienBaru);
router.post("/jadwalOperasiRs", antreanController.jadwalOperasiRs);
router.post("/jadwalOperasiPasien", antreanController.jadwalOperasiPasien);
router.post("/ambilAntreanFarmasi", antreanController.ambilAntreanFarmasi);
router.post("/statusAntreanFarmasi", antreanController.statusAntreanFarmasi);





router.post("/updateWaktu", antreanController.updateWaktu);
router.post("/listWaktuTaskid", antreanController.listWaktuTaskid);
router.post("/dashboardPertanggal", antreanController.dashboardPertanggal);
router.post("/dashboardPerbulan", antreanController.dashboardPerbulan);
router.post("/antreanPertanggal", antreanController.antreanPertanggal);
router.post("/antreanPerkodebooking", antreanController.antreanPerkodebooking);
router.post("/antreanBelumdilayani", antreanController.antreanBelumdilayani);
router.post("/antreanBelumdilayaniPer", antreanController.antreanBelumdilayaniPer);
router.post("/panggilAntrean", antreanController.panggilAntrean);
router.post("/hadirAntrean", antreanController.hadirAntrean);
router.get("/referensiPoli", antreanController.referensiPoli);
router.get("/referensiDokter", antreanController.referensiDokter);
router.get("/referensiPoliFingerPrint", antreanController.referensiPoliFingerPrint);
router.post("/referensiPasienFingerPrint", antreanController.referensiPasienFingerPrint);
router.post("/updateJadwalDokter", antreanController.updateJadwalDokter);
router.post("/jadwalDokter", antreanController.jadwalDokter);

module.exports = router;