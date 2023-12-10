function getDashboard(req, res) {
  res.render("admin/dashboard");
}

function getManageProduct(req, res) {
  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      message: "",
      name: "",
      email: "",
    };
  }

  req.session.inputData = null;
  res.render("admin/manage-products", { inputData: sessionInputData });
}

function getManageOrders(req, res) {
  res.render("admin/manage-orders");
}

function postManageProducts(req, res) {
  res.redirect("/products");
}

function getManageCategory(req, res) {
  res.render("admin/manage-categories");
}

function postManageCategory(req, res) {
  const title = req.body;
  console.log(title);
  res.redirect("/admin/categories");
}

module.exports = {
  getDashboard: getDashboard,
  getManageProduct: getManageProduct,
  postManageProducts: postManageProducts,
  getManageOrders: getManageOrders,
  getManageCategory: getManageCategory,
  postManageCategory: postManageCategory,
};
