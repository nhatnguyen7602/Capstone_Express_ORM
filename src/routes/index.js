const express = require("express");
const rootRoute = express.Router();
const anhRoute = require("./anhRoute");
const authRoute = require("./authRoute");
const binhLuanRoute = require("./binhLuanRoute");
const nguoiDungRoute = require("./nguoiDungRoute");

rootRoute.use("/anh", anhRoute);
rootRoute.use("/auth", authRoute);
rootRoute.use("/binhLuan", binhLuanRoute);
rootRoute.use("/nguoiDung", nguoiDungRoute);

module.exports = rootRoute;
