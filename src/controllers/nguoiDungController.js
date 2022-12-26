const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../config/response");
const { decodeToken } = require("../middlewares/baseToken");
const fs = require("fs");

const prisma = new PrismaClient();

const getThongTinNguoiDung = async (req, res) => {
  try {
    let { token } = req.headers;

    let nguoi_dung_id = decodeToken(token).data.nguoi_dung_id;

    let data = await prisma.nguoi_dung.findFirst({ where: { nguoi_dung_id } });

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const updateNguoiDungCoAvatar = async (req, res) => {
  try {
    let { token } = req.headers;
    let { email, mat_khau, ho_ten, tuoi } = req.body;

    let nguoi_dung_id = decodeToken(token).data.nguoi_dung_id;

    if (!req.file) {
      failCode(res, "", "Vui lòng thêm ảnh!");
    } else {
      if (req.file.size >= 400000) {
        fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);

        failCode(res, "", "Dung lượng không được quá 4MB!");

        return;
      }

      if (
        req.file.mimetype != "image/jpeg" &&
        req.file.mimetype != "image/png" &&
        req.file.mimetype != "image/jpg"
      ) {
        fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);

        failCode(res, "", "Sai định dạng!");
      }

      fs.readFile(
        process.cwd() + "/public/img/" + req.file.filename,
        async (err, data) => {
          let anh_dai_dien = `data:${req.file.mimetype};base64,${Buffer.from(
            data
          ).toString("base64")}`;

          await prisma.nguoi_dung.update({
            where: { nguoi_dung_id },
            data: { email, mat_khau, ho_ten, tuoi: +tuoi, anh_dai_dien },
          });

          fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);

          successCode(res, "", "Cập nhật thành công!");
        }
      );
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const updateNguoiDung = async (req, res) => {
  try {
    let { token } = req.headers;
    let { email, mat_khau, ho_ten, tuoi } = req.body;

    let nguoi_dung_id = decodeToken(token).data.nguoi_dung_id;

    await prisma.nguoi_dung.update({
      where: { nguoi_dung_id },
      data: { email, mat_khau, ho_ten, tuoi },
    });

    successCode(res, "", "Cập nhật thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

module.exports = {
  getThongTinNguoiDung,
  updateNguoiDungCoAvatar,
  updateNguoiDung,
};
