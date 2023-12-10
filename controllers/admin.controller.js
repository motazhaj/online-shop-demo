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
  res.redirect("admin/products");
}

module.exports = {
  getDashboard: getDashboard,
  getManageProduct: getManageProduct,
  postManageProducts: postManageProducts,
  getManageOrders: getManageOrders,
};
