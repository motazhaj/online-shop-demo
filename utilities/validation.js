function isEmpty(value) {
  return !value || value.trim() === "";
}

function validateSignupData(req, userData) {
  req.session.inputData = {
    hasError: false,
    message: "",
    email: userData.email,
    name: userData.name,
    city: userData.city,
    address: userData.address,
  };

  if (
    isEmpty(userData.email) ||
    isEmpty(userData.password) ||
    isEmpty(userData["confirm-password"]) ||
    isEmpty(userData.name) ||
    isEmpty(userData.city) ||
    isEmpty(userData.address)
  ) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Please fill all fields";
    return false;
  }
  if (!userData.email.includes("@")) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Email Incorrect";
    return false;
  }
  if (userData.password.trim().length < 6) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Password is not long enough";
    return false;
  }
  if (userData.password !== userData["confirm-password"]) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "Passwords do not match";
    return false;
  }

  return true;
}

async function validateExistingUser(req, user) {
  const existingUser = await user.getUserByEmail();

  if (existingUser) {
    req.session.inputData.hasError = true;
    req.session.inputData.message = "User already exists";
    return true;
  }

  return false;
}

module.exports = {
  validateSignupData: validateSignupData,
  validateExistingUser: validateExistingUser,
};
