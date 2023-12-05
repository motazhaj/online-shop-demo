const express = require("express");

const authRoutes = require("../controllers/auth.controller");

const router = express.Router();

router.get("/signup", authRoutes.getSignup);

router.post("/signup", authRoutes.postSignup);

router.get("/login", authRoutes.getLogin);

router.post("/login", authRoutes.postLogin);

module.exports = router;