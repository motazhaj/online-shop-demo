const adminRoutes = require("../controllers/admin.controller")

router.get("/dashboard", adminRoutes.getDashboard);

router.get("/add-product", adminRoutes.getAddProduct);

router.post("/add-product", adminRoutes.postAddProduct);
