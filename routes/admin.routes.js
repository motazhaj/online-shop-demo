const express = require("express");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard", adminController.getDashboard);

router.get("/products", adminController.getManageProducts);
router.post("/products/new", adminController.postManageProducts);

router.get("/orders", adminController.getManageOrders);

router.get("/categories", adminController.getManageCategory);
router.post("/categories/new", adminController.postManageCategory);

module.exports = router;