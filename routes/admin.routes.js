const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/file-upload");

const router = express.Router();

router.get("/dashboard", adminController.getDashboard);

router.get("/products", adminController.getManageProducts);
router.post(
  "/products/new",
  imageUploadMiddleware,
  adminController.postManageProducts
);

router.get("/orders", adminController.getManageOrders);

router.get("/categories", adminController.getManageCategory);
router.post("/categories/new", adminController.postManageCategory);

router.get("/products/edit/:id", adminController.getEditProduct)
router.post("/products/edit/:id", adminController.postEditProduct)


module.exports = router;
