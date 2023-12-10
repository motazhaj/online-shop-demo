const express = require("express");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard", adminController.getDashboard);

router.get("/products", adminController.getManageProduct);

router.post("/products/new", adminController.postManageProducts);

router.get("/orders", adminController.getManageOrders);

module.exports = router;