const express = require("express");

const mainContoller = require("../controllers/main.controller");

const router = express.Router();

router.get("/", mainContoller.getShop);

module.exports = router;
