const Category = require("../models/category.model");
const Product = require("../models/product.model");

function getDashboard(req, res) {
  res.render("admin/dashboard");
}

async function getManageProducts(req, res) {
  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      message: "",
      title: "",
      description: "",
      price: 0,
      category: "",
    };
  }

  req.session.inputData = null;

  const categories = await Category.getCategories();

  res.render("admin/manage-products", {
    inputData: sessionInputData,
    categories: categories,
  });
}

async function postManageProducts(req, res) {
  const category = new Category(req.body.category);

  req.session.inputData = {
    hasError: false,
    message: "",
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.Category,
  };

  const existingCategoryBool = await category.getCategoryByName();

  if (!existingCategoryBool) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Category does not exists";
    req.session.save(() => {
      res.redirect("/admin/products");
    });
    return;
  }

  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next();
    return;
  }
  console.log(product);

  res.redirect("/admin/products");
}

async function getManageCategory(req, res) {
  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      message: "",
      title: "",
    };
  }

  req.session.inputData = null;

  const categories = await Category.getCategories();

  req.session.inputData = null;

  res.render("admin/manage-categories", {
    inputData: sessionInputData,
    categories: categories,
  });
}

async function postManageCategory(req, res) {
  const userData = req.body;
  const category = new Category(userData.title);

  req.session.inputData = {
    hasError: false,
    message: "",
    title: userData.title,
  };

  const existingCategoryBool = await category.getCategoryByName();

  console.log(existingCategoryBool);

  if (existingCategoryBool) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Category already exists";
    req.session.save(() => {
      res.redirect("/admin/categories");
    });
    return;
  }

  try {
    await category.saveCategory();
  } catch (error) {
    next();
    return;
  }

  req.session.save(() => {
    res.redirect("/admin/categories");
  });
  return;
}

function getManageOrders(req, res) {
  res.render("admin/manage-orders");
}

module.exports = {
  getDashboard: getDashboard,
  getManageProducts: getManageProducts,
  postManageProducts: postManageProducts,
  getManageOrders: getManageOrders,
  getManageCategory: getManageCategory,
  postManageCategory: postManageCategory,
};
