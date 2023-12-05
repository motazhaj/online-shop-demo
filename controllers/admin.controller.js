function getDashboard(req, res) {
  res.render("admin/dashboard");
}

function getAddProduct(req, res) {
  res.render("admin/add-product");
}

function postAddProduct(req, res) {
  res.redirect("/add-product");
}

module.exports = {
  getDashboard: getDashboard,
  getAddProduct: getAddProduct,
  postAddProduct: postAddProduct,
};
