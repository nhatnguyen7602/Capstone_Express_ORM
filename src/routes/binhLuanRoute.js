const express = require("express");
const {
  getBinhLuanTheoIdAnh,
  postBinhLuan,
} = require("../controllers/binhLuanController");
const { verifyToken } = require("../middlewares/baseToken");

const binhLuanRoute = express.Router();

binhLuanRoute.get("/getBinhLuan/:idAnh", verifyToken, getBinhLuanTheoIdAnh);
binhLuanRoute.post("/postBinhLuan", verifyToken, postBinhLuan);

module.exports = binhLuanRoute;
