const express = require("express");
const router = express.Router();
const antreanAdmisiController = require("../app/api/controllers/admisi");

router.post("/ambilAntrean", antreanAdmisiController.ambilAntrean);
router.post("/ambilAntrean/poli", antreanAdmisiController.ambilAntreanPoli);
router.post("/sisaAntrean", antreanAdmisiController.sisaAntrean);
router.post("/jadwalDokter", antreanAdmisiController.jadwalDokter);
router.post("/addJadwalOperasi", antreanAdmisiController.addJadwalOperasi);
router.post("/search", antreanAdmisiController.searchAntrean);
router.post("/search/pasien", antreanAdmisiController.searchPasien);
router.post("/search/pasien/nokartu", antreanAdmisiController.searchPasienNokartu);
router.post("/search/antrean/nokartu", 
     antreanAdmisiController.searchAntreanNokartu);
router.post("/poli/all", antreanAdmisiController.allPoli);
router.post("/admfar/all", antreanAdmisiController.allAdmFar);
router.post("/update/waktu", antreanAdmisiController.updateWaktu);
router.post("/jadwal/operasi", antreanAdmisiController.jadwalOperasi);
router.post("/jadwal/operasi/pasien", antreanAdmisiController.jadwalOperasiPasien);
router.post("/jadwal/operasi/update", antreanAdmisiController.updateJadwalOperasi);
router.post("/antrean/batal", antreanAdmisiController.getBatalAntrean);
router.get("/tempattidur/tersedia", antreanAdmisiController.ketersediaanTempatTidur);
router.get("/tempattidur/ref/kelas", antreanAdmisiController.refKelas);
router.post("/tempattidur/tambah", antreanAdmisiController.tambahTempatTidur);
router.post("/tempattidur/update", antreanAdmisiController.updateTempatTidur);
router.post("/tempattidur/delete", antreanAdmisiController.deleteTempatTidur);

module.exports = router; 