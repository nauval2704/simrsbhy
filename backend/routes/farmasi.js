const express = require("express");
const router = express.Router();
const farmasiController = require("../app/api/controllers/farmasi");

router.get("/getnotif", farmasiController.getNotif);
router.get(
  "/laporan/apotek/start/:start/end/:end",
  farmasiController.laporanApotek
);
router.get("/laporan/igd/start/:start/end/:end", farmasiController.laporanIgd);
router.get("/laporan/inap/start/:start/end/:end", farmasiController.laporanInap);
router.get(
  "/request/gudang/start/:start/end/:end/from/:from",
  farmasiController.getRequestGudang
);
router.get("/stock/apotek", farmasiController.getStockApotek);
router.get("/stock/igd", farmasiController.getStockIgd);
router.get("/stock/inap", farmasiController.getStockInap);
router.post("/request/apotek/selesai", farmasiController.requestApotekSelesai);
router.post("/request/igd/selesai", farmasiController.requestIgdSelesai);
router.post("/delete/rincian", farmasiController.deleteRincian);
router.get("/rincian/:noCheckin", farmasiController.getRincianFarmasi);
router.get("/print/obat1/:noCheckin", farmasiController.printObat1);
//tambah reesep
router.post("/add/resep", farmasiController.addResep);
//get data resep by nocheckin
router.post("/resep", farmasiController.getResepByNoCheckin);
router.post("/billing", farmasiController.billingFarmasi);
router.post("/print/obat", farmasiController.printObat);
// hapus resep by id
router.post("/delete/resep", farmasiController.deleteResep);
// input resep
router.post("/input/resep", farmasiController.inputResep);
// input resep racikan
router.post("/input/resep/racikan", farmasiController.inputResepRacikan);
// hapus obar resep
router.post("/delete/obat/resep", farmasiController.deletObatResep);
// get detail resep by nocheckin
router.post("/detail/resep", farmasiController.detailResep);
//edit resep
router.post("/billing/edit/total", farmasiController.editTotal);
//edit margin
router.post("/billing/margin", farmasiController.getMarginHarga);
router.post("/billing/margin/harga", farmasiController.marginHarga);

module.exports = router;
