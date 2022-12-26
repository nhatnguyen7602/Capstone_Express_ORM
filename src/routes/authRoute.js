const express = require("express");
const { createNguoiDung, login } = require("../controllers/authController");

const authRoute = express.Router();

authRoute.post("/createNguoiDung", createNguoiDung);
authRoute.post("/login", login);

module.exports = authRoute;
