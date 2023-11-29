const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("shop");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const userData = req.body
  console.log(userData)
  res.redirect("/")
});

module.exports = router;
