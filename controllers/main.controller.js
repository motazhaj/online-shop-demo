const Product = require("../models/product.model");

async function getShop(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("customer/shop", { products: products });
  } catch (error) {
    next();
    return;
  }
}

module.exports = {
  getShop: getShop,
};
