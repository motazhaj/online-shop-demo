const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const db = require("../data/database");

function getLogin(req, res) {
  res.render("customer/login");
}

async function postLogin(req, res) {
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
}

function getSignup(req, res) {
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

  res.render("customer/signup", { inputData: sessionInputData });
}

async function postSignup(req, res) {
  const userData = req.body;
  const inEmail = userData.email;
  const inPassword = userData.password;
  const inConfirmPassword = userData["confirm-password"];
  const inName = userData.name;
  const inCity = userData.city;
  const inAddress = userData.address;

  req.session.inputData = {
    hasError: false,
    message: "",
    name: inName,
    email: inEmail,
    city: inCity,
    address: inAddress,
  };

  // Validation
  if (
    !inName ||
    !inEmail ||
    !inPassword ||
    !inConfirmPassword ||
    !inCity ||
    !inAddress
  ) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Please fill all fields";
    req.session.save(() => {
      res.redirect("/signup");
      return;
    });
  }
  if (!inEmail.includes("@")) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Email Incorrect";
    res.redirect("/signup");
    return;
  }
  if (inPassword.trim().length < 6) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Password is not long enough";
    res.redirect("/signup");
    return;
  }
  if (inPassword !== inConfirmPassword) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Passwords do not match";
    res.redirect("/signup");
    return;
  }
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: inEmail });

  if (existingUser) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "User already exists";
    res.redirect("/signup");
    return;
  }

  const user = new User(inEmail, inPassword, inName, inCity, inAddress);

  await user.signup()

  req.session.save(() => {
    res.redirect("/login");
  });
  return;
}

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  getSignup: getSignup,
  postSignup: postSignup,
};
