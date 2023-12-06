const User = require("../models/user.model");
const authUtil = require("../utilities/authentication");
const validation = require("../utilities/validation");

function getLogin(req, res) {
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
  res.render("customer/login", { inputData: sessionInputData });
}

async function postLogin(req, res, next) {
  const userData = req.body;
  const user = new User(userData.email, userData.password);
  let existingUser;

  req.session.inputData = {
    hasError: false,
    message: "",
    email: userData.email,
  };

  try {
    existingUser = await user.getUserByEmail();
  } catch (error) {
    next();
    return;
  }

  if (!existingUser) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "User doesnt exist";
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  const passwordMatch = await user.matchPassword(existingUser.password);

  if (!passwordMatch) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Wrong Password";
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
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

async function postSignup(req, res, next) {
  const userData = req.body;
  let validateBool;

  validateBool = validation.validateSignupData(req, userData);

  console.log(validateBool);

  if (!validateBool) {
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const user = new User(
    userData.email,
    userData.password,
    userData.name,
    userData.city,
    userData.address
  );

  let existingUserBool;
  try {
    existingUserBool = await validation.validateExistingUser(req, user);
  } catch (error) {
    next();
    return;
  }

  if (existingUserBool) {
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  try {
    await user.signup();
  } catch (error) {
    next();
    return;
  }

  req.session.save(() => {
    res.redirect("/login");
  });
  return;
}

async function postLogout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/");
}

module.exports = {
  getLogin: getLogin,
  postLogin: postLogin,
  getSignup: getSignup,
  postSignup: postSignup,
  postLogout: postLogout,
};
