const express = require("express");
const router = express.Router();
const importController = require("../app/api/controllers/icare");

router.post("/fkrtl", importController.icareFkrtl);
router.post("/fktp", importController.icareFktp);

module.exports = router;