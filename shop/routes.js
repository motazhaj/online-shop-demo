const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("shop");
});

router.get("/signup", (req, res) => {
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

  res.render("signup", { inputData: sessionInputData });
});

router.post("/signup", async (req, res) => {
  const userData = req.body;
  const inName = userData.name;
  const inEmail = userData.email;
  const inPassword = userData.password;
  const inConfirmPassword = userData["confirm-password"];

  req.session.inputData = {
    hasError: false,
    message: "",
    name: inName,
    email: inEmail,
  };

  // Validation
  if (!inName || !inEmail || !inPassword || !inConfirmPassword) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Please fill all fields";
    req.session.save(() => {
      return res.redirect("/signup");
    });
  }
  if (!inEmail.includes("@")) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Email Incorrect";
    return res.redirect("/signup");
  }
  if (inPassword.trim().length < 6) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Password is not long enough";
    return res.redirect("/signup");
  }
  if (inPassword !== inConfirmPassword) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Passwords do not match";
    return res.redirect("/signup");
  }
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: inEmail });

  if (existingUser) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "User already exists";
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(inPassword, 12);
  const user = {
    name: inName,
    email: inEmail,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);
  req.session.save(() => {
    res.redirect("/login");
  });
  return;
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const userData = req.body;
  const inEmail = userData.email;
  const inPassword = userData.password;

  req.session.inputData = {
    hasError: false,
    message: "",
    email: inEmail,
  };

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: inEmail });
  if (!existingUser) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "User doesnt exist";
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(inPassword, existingUser.password);

  if (!passwordMatch) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Wrong Password";
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  req.session.isAuthenticated = true;
  req.session.save(() => {
    res.redirect("/");
  });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/add-product", (req, res, next) => {
  res.render("add-product");
});

router.post("/add-product", (req, res) => {
  const productData = req.body;

  res.render("add-product");
});

module.exports = router;
