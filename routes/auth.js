const express = require("express");
const { route } = require("express/lib/router");

const router = express.Router();

const { login, register } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);

module.exports = router