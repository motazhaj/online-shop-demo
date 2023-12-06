const User = require("../models/user.model");
const authUtil = require("../utilities/authentication");

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
  const inEmail = userData.email;
  const inPassword = userData.password;
  const inConfirmPassword = userData["confirm-password"];
  const inName = userData.name;
  const inCity = userData.city;
  const inAddress = userData.address;

  let existingUser;

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
    });
    return;
  }
  if (!inEmail.includes("@")) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Email Incorrect";
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }
  if (inPassword.trim().length < 6) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Password is not long enough";
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }
  if (inPassword !== inConfirmPassword) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Passwords do not match";
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  try {
    existingUser = await user.getUserByEmail();
  } catch (error) {
    next();
    return;
  }

  if (existingUser) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "User already exists";
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const user = new User(inEmail, inPassword, inName, inCity, inAddress);

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
