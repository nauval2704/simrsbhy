const express = require("express");
const router = express.Router();
const authController = require("../app/api/controllers/auth");

router.get("/auth", authController.login);

module.exports = router; 