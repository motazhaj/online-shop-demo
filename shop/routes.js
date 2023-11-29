const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("shop");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const userData = req.body;
  const inName = userData.name;
  const inEmail = userData.email;
  const inPassword = userData.password;
  const inConfirmPassword = userData["confirm-password"];

  // Validation
  if (!inName || !inEmail || !inPassword || !inConfirmPassword) {
    console.log("Missing input");
    return res.redirect("/signup");
  }
  if (!inEmail.includes("@")) {
    console.log("Email Incorrect");
    return res.redirect("/signup");
  }
  if (inPassword.trim().length < 6) {
    console.log("Password is not long enough");
    return res.redirect("/signup");
  }
  if (inPassword !== inConfirmPassword) {
    console.log("Passwords dont match");
    return res.redirect("/signup");
  }
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: inEmail });

  if (existingUser) {
    console.log("User already exists");
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(inPassword, 12);
  const user = {
    name: inName,
    email: inEmail,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);
  res.redirect("/");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const userData = req.body;
  const inEmail = userData.email;
  const inPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: inEmail });
  if (!existingUser) {
    console.log("Email doesnt exist");
    return res.redirect("/login");
  }

  const passwordMatch = await bcrypt.compare(inPassword, existingUser.password);

  if (!passwordMatch) {
    console.log("Wrong Password");
    return res.redirect("/login");
  }

  req.session.isAuthenticated = true;
  res.redirect("/")
});

module.exports = router;
