const express = require("express");
const router = express.Router();
const gudangController = require("../app/api/controllers/gudang");

router.post("/distributor", gudangController.addDistributor);
router.get("/distributor", gudangController.getDistributor);
router.get("/distributor/:id", gudangController.getDistributorById);
router.post("/input", gudangController.inputFaktur);
router.post("/obatLuar", gudangController.obatLuar);
router.post("/barangBhp/:stock", gudangController.barangBhp);
router.get("/faktur", gudangController.getFaktur);
router.post("/list", gudangController.getFakturByNoFaktur);
router.post("/list/tanggal", gudangController.getFakturByTanggalFaktur);
router.post("/jenisSediaan", gudangController.addJenisSediaan);
router.get("/jenisSediaan", gudangController.getJenisSediaan);
router.post("/satuan", gudangController.addSatuan);
router.get("/satuan", gudangController.getSatuan);
router.get(
  "/faktur/start/:start/end/:end",
  gudangController.getFakturItemsByDate
);
router.get(
  "/hutang/start/:start/end/:end",
  gudangController.getRincianHutangItemsByDate
);
router.get(
  "/beritaAcara/start/:start/end/:end",
  gudangController.getBeritaAcaraItemsByDate
);
router.get(
  "/laporan/gudang/start/:start/end/:end",
  gudangController.laporanGudang
);

router.get("/laporan/sppm/start/:start/end/:end", gudangController.laporanSppm);
router.post("/kategori", gudangController.addKategori);
router.get("/kategori", gudangController.getKategori);
router.post("/daftar/:kategori", gudangController.addDaftarItems);
router.get("/daftar/:kategori", gudangController.getdaftarItems);
router.post("/request/gudang", gudangController.addRequestGudang);
router.get("/request/gudang", gudangController.getRequestGudang);
router.post("/request/selesai", gudangController.requestGudangSelesai);
router.post("/request/batal", gudangController.requestGudangBatal);
router.post("/delete/barang", gudangController.deleteBarang);
router.get("/stock/:kategori", gudangController.getdaftarItemsByStock);
router.get("/stock/obatLuar/:kategori", gudangController.getListObatLuar);
router.post("/employee/add", gudangController.addEmployee);
router.post("/employee/list", gudangController.getEmployee);

module.exports = router;
