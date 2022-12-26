const express = require("express");
const {
  getThongTinNguoiDung,
  updateNguoiDungCoAvatar,
  updateNguoiDung,
} = require("../controllers/nguoiDungController");
const { verifyToken } = require("../middlewares/baseToken");
const { upload } = require("../middlewares/upload");

const nguoiDungRoute = express.Router();

nguoiDungRoute.get("/getThongTinNguoiDung", verifyToken, getThongTinNguoiDung);

nguoiDungRoute.put("/updateNguoiDung", verifyToken, updateNguoiDung);
nguoiDungRoute.put(
  "/updateNguoiDungCoAvatar",
  upload.single("dataAvatar"),
  updateNguoiDungCoAvatar
);

module.exports = nguoiDungRoute;
