const express = require("express");
const router = express.Router();
const simrsBaController = require("../app/api/controllers/simrsba");

router.post("/checkpasien", simrsBaController.checkpasien);
router.post("/aksesuser", simrsBaController.hakUser);
router.post("/daftar/pasienbaru", simrsBaController.daftarPasienbaru);
router.post("/daftar/editdatapasien", simrsBaController.editDataPasien);
router.post("/rujukan/insert", simrsBaController.insertRujukan);
router.post("/rujukan/lokal", simrsBaController.getLokalRujukan);
router.post("/rujukan/lokal/kartu", simrsBaController.getLokalRujukanKartu);
router.get("/caripasien/:term", simrsBaController.cariPasien);
router.get(
  "/caripasiennocheckin/:noCheckin",
  simrsBaController.cariPasienNocheckin
);
router.get("/caripasiennomr/:noMr", simrsBaController.cariPasienNoMr);
router.get("/caripasiennik/:nik", simrsBaController.cariPasienNik);
router.get("/caripasiennokartu/:noKartu", simrsBaController.caripasiennokartu);
router.get(
  "/caripasiennorujukan/:norujukan",
  simrsBaController.cariPasienNoRujukan
);
router.get("/cetak/obat/:noCheckin", simrsBaController.printObatv1);
router.get("/caripasiennosep/:nosep", simrsBaController.cariPasienNoSep);
router.get(
  "/carirujukannokartu/:nokartu",
  simrsBaController.cariRujukanNoKartu
);
router.get(
  "/carirujukannorujukan/:norujukan",
  simrsBaController.cariRujukanNoRujukan
);
router.get(
  "/carisuratkontrol/:nosuratkontrol",
  simrsBaController.cariSuratKontrol
);
router.get("/updatecounter/:nocheckin", simrsBaController.updateCounter);
router.get("/countSep/:noSep", simrsBaController.countSep);
router.get("/countNoRujukan/:noRujukan", simrsBaController.countNoRujukan);
router.get("/caridokter/:term", simrsBaController.cariDokter);
router.get("/pasienbaru", simrsBaController.pasienBaru);
router.get("/caripasien/norm/:term", simrsBaController.cariPasienNorm);
router.get("/cariruang/:term", simrsBaController.cariRuang);
router.get("/caripasienpoli", simrsBaController.cariPasienPoli);
router.get("/caripasienpoli/:norm", simrsBaController.cariPasienPoliNorm);
router.get(
  "/caripasienpolinocheckin/:noCheckin",
  simrsBaController.caripasienpolinocheckin
);

router.get("/checknosep/:nosep", simrsBaController.checknosep);
router.get("/caripasieninap", simrsBaController.cariPasienInap);
router.get("/caripasieninap/:norm", simrsBaController.cariPasienInapNorm);
router.get("/caridatakunjungan/:nosep", simrsBaController.cariDataKunjungan);
router.get(
  "/caridatakunjungannosep/:nosep",
  simrsBaController.cariDataKunjunganNoSep
);
router.get(
  "/caripasieninapnocheckin/:noCheckin",
  simrsBaController.caripasieninapnocheckin
);
router.get(
  "/caripasien/pelayanan/:pelayanan",
  simrsBaController.cariPasienPelayanan
);
router.get(
  "/caripasien/pelayanan/:pelayanan/norm/:norm",
  simrsBaController.cariPasienPelayananNorm
);
router.get(
  "/caripasien/pelayanan/:pelayanan/nocheckin/:noCheckin",
  simrsBaController.cariPasienPelayananNoCheckin
);
router.post("/saveSep", simrsBaController.saveSep);
router.get("/getDataSepSimrs/:noSep", simrsBaController.getDataSepSimrs);
router.get(
  "/getDataSepSimrsNoKartu/:noKartu",
  simrsBaController.getDataSepSimrsNoKartu
);
router.post("/checkin", simrsBaController.checkin);
router.post("/checkout", simrsBaController.checkout);
router.post("/updatedatapasien", simrsBaController.updatedatapasien);
router.post("/updatedatasep", simrsBaController.updatedatasep);
router.post("/updatenorujukan", simrsBaController.updatenorujukan);
router.post("/updateruang", simrsBaController.updateruang);
router.post("/updateruangmasuk", simrsBaController.updateruangmasuk);
router.post("/tarifbaru", simrsBaController.tarifBaru);
router.post("/edittarif", simrsBaController.editTarif);
router.post("/editstock", simrsBaController.editStock);
router.post("/edittariffarmasi", simrsBaController.editTarifFarmasi);
router.get("/createtarif/:nama", simrsBaController.createTarif);
router.get("/createnakes/:nama", simrsBaController.createNakes);
router.get("/createruang/:nama", simrsBaController.createRuang);
router.get(
  "/gettarifpelayanan/:pelayanan",
  simrsBaController.getTarifPelayanan
);
router.get("/gettarifnotarif/:notarif", simrsBaController.getTarifNoTarif);
router.post("/deletetarif", simrsBaController.deleteTarif);
router.get("/gettarif/IGD/nama/:term", simrsBaController.getTarif);
router.get("/gettarif/FARMASI/nama/:term", simrsBaController.getTarifFarmasi);
router.get("/gettarif/LAB/nama/:term", simrsBaController.getTarifLAB);
router.get(
  "/gettarif/RADIOLOGI/nama/:term",
  simrsBaController.getTarifRadiologi
);
router.get("/getrincian/:noCheckin", simrsBaController.getRincian);
router.get("/getrincian/IGD/:noCheckin", simrsBaController.getRincianIgd);
router.get("/getrincian/INAP/:noCheckin", simrsBaController.getRincianIgd);
router.get("/getrincian/BEDAH/:noCheckin", simrsBaController.getRincianBedah);
router.get(
  "/getrincian/FARMASI/:noCheckin",
  simrsBaController.getRincianFarmasi
);
router.get("/getrincian/LAB/:noCheckin", simrsBaController.getRincianLAB);
router.get(
  "/getrincian/RADIOLOGI/:noCheckin",
  simrsBaController.getRincianRadiologi
);
router.get("/getpasienlab", simrsBaController.getPasienLab);
router.get("/getpasienradiologi", simrsBaController.getPasienRadiologi);
router.post("/inputrincian", simrsBaController.inputRincian);

router.post("/deleterincian", simrsBaController.deleteRincian);
router.get(
  "/home/dashboard/kunjungan",
  simrsBaController.homeDashboardKunjungan
);
router.get(
  "/home/dashboard/pasienbaru",
  simrsBaController.homeDashboardPasienBaru
);
router.get("/home/dashboard/cancel", simrsBaController.homeDashboardCancel);
router.get("/cariuser", simrsBaController.cariUser);
router.get("/getriwayat/:norm", simrsBaController.getRiwayat);
router.get(
  "/laporan/igd/:start/:end/:keterangan",
  simrsBaController.getLaporanIgd
);
router.get(
  "/laporan/poli/:start/:end/:keterangan",
  simrsBaController.getLaporanPoli
);
router.get(
  "/laporan/inap/:start/:end/:keterangan",
  simrsBaController.getLaporanInap
);
router.get(
  "/laporan/cabar/:start/:end/:cabar",
  simrsBaController.getLaporanCabar
);
router.get(
  "/laporan/diagnosa/:start/:end",
  simrsBaController.getLaporanDiagnosa
);
router.get(
  "/getlastkunjungan/:nokontrolulang",
  simrsBaController.getLastKunjungan
);
router.post("/updatetglkontrolulang", simrsBaController.updatetku);
router.post("/updatetglio", simrsBaController.updatetio);
router.post("/bukaCheckout", simrsBaController.bukaCheckout);
router.get("/graphPasien/:cabar", simrsBaController.graphPasien);
router.get(
  "/jenis-pasien/start/:start/end/:end",
  simrsBaController.jenisPasien
);
router.post("/triase", simrsBaController.saveTriase);
router.get("/triase/:noCheckin", simrsBaController.getTriase);
router.post("/triase/sync-satusehat", simrsBaController.syncTriaseSatuSehat);

router.post("/prmrj", simrsBaController.savePrmrj);
router.get("/prmrj/:noCheckin", simrsBaController.getPrmrj);

router.post("/edukasi-poli", simrsBaController.saveEdukasiPoli);
router.get("/edukasi-poli/:noCheckin", simrsBaController.getEdukasiPoli);

router.post("/cppt-igd", simrsBaController.saveCpptIgd);
router.get("/cppt-igd/:noCheckin", simrsBaController.getCpptIgd);

router.post("/ringkasan-pulang", simrsBaController.saveRingkasanPulang);
router.get("/ringkasan-pulang/:noCheckin", simrsBaController.getRingkasanPulang);

router.post("/poli-gigi", simrsBaController.savePoliGigi);
router.get("/poli-gigi/:noCheckin", simrsBaController.getPoliGigi);

router.post("/lab/save", simrsBaController.saveLab);
router.post("/rad/save", simrsBaController.saveRad);

module.exports = router;
