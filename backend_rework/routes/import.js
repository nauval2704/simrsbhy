const express = require("express");
const router = express.Router();
const importController = require("../app/api/controllers/import");

router.get("/stock", importController.importStock);
router.get("/stock/delete", importController.deleteStock);

router.get("/stock/apotek", importController.importStockApotek);
router.get("/stock/apotek/delete", importController.deleteStockApotek);

module.exports = router;
