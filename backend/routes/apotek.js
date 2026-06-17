const express = require("express");
const router = express.Router();
const apotekController = require("../app/api/controllers/apotek");

router.get("/stock/:kategori", apotekController.getdaftarItemsByKategori);
router.get("/stock/inap/:kategori", apotekController.getdaftarItemsInapByKategori);
router.get("/stock/igd/:kategori", apotekController.getdaftarItemsIgdByKategori);
router.get("/stock/gudang/:kategori", apotekController.getdaftarItemsGudangByKategori);
router.post("/request/apotek/igd", apotekController.addRequestApotekFromIgd);
router.get("/request/apotek", apotekController.getRequestApotek);
router.get(
  "/request/apotek/start/:start/end/:end",
  apotekController.getRekapRequestApotek
);
router.post("/request/selesai", apotekController.requestApotekSelesai);
router.post("/request/batal", apotekController.requestApotekBatal);

router.post("/ambil/igd", apotekController.ambilStockIgd);
router.post("/ambil/inap", apotekController.ambilStockInap);
router.post("/ambil/apotek", apotekController.ambilStockApotek);
router.post("/ambil/gudang", apotekController.ambilStockGudang);
router.post("/ambil/luar", apotekController.ambilStockLuar);
router.post("/tambah/igd", apotekController.tambahStockIgd);
router.post("/tambah/inap", apotekController.tambahStockInap);
router.post("/tambah/apotek", apotekController.tambahStockApotek);
router.post("/tambah/gudang", apotekController.tambahStockGudang);
router.post("/tambah/luar", apotekController.tambahStockLuar);
router.post("/logsobat", apotekController.logsObat);


module.exports = router;
