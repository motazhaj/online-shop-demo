const adminController = require("../controllers/admin.controller")

router.get("/dashboard", adminController.getDashboard);

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);
