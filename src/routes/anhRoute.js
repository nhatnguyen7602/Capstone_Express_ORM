const express = require("express");
const {
  getAnh,
  getAnhTheoTen,
  getThongTinTheoIdAnh,
  getLuuAnhTheoIdAnh,
  getAnhDaLuu,
  getAnhDaTao,
  deleteAnh,
  uploadAnh,
  postLuuAnh,
} = require("../controllers/anhController");
const { verifyToken } = require("../middlewares/baseToken");
const { upload } = require("../middlewares/upload");

const anhRoute = express.Router();

anhRoute.get("/getAnh", verifyToken, getAnh);
anhRoute.get("/getAnh/:tenAnh", verifyToken, getAnhTheoTen);
anhRoute.get("/getThongTinAnh/:idAnh", verifyToken, getThongTinTheoIdAnh);
anhRoute.get("/getLuuAnh/:idAnh", verifyToken, getLuuAnhTheoIdAnh);
anhRoute.get("/getAnhDaLuu", verifyToken, getAnhDaLuu);
anhRoute.get("/getAnhDaTao", verifyToken, getAnhDaTao);

anhRoute.delete("/deleteAnh/:idAnh", verifyToken, deleteAnh);

anhRoute.post("/uploadAnh", upload.single("dataUpload"), uploadAnh);
anhRoute.post("/postLuuAnh", verifyToken, postLuuAnh);

module.exports = anhRoute;
