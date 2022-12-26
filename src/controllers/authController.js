const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../config/response");
const { parseToken } = require("../middlewares/baseToken");

const prisma = new PrismaClient();

const createNguoiDung = async (req, res) => {
  try {
    let { email, mat_khau, ho_ten, tuoi } = req.body;

    let checkEmail = await prisma.nguoi_dung.findFirst({ where: { email } });

    if (checkEmail) {
      failCode(res, "", "Email đã tồn tại!");
    } else {
      await prisma.nguoi_dung.create({
        data: { email, mat_khau, ho_ten, tuoi },
      });

      successCode(res, "", "Đăng ký thành công!");
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const login = async (req, res) => {
  try {
    let { email, mat_khau } = req.body;

    let checkLogin = await prisma.nguoi_dung.findFirst({ where: { email } });

    if (checkLogin) {
      let checkPass = checkLogin.mat_khau;

      if (mat_khau === checkPass) {
        successCode(res, parseToken(checkLogin), "Đăng nhập thành công!");
      } else {
        failCode(res, "", "Mật khẩu không đúng!");
      }
    } else {
      failCode(res, "", "Email không đúng!");
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

module.exports = { createNguoiDung, login };
