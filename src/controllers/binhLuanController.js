const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../config/response");
const { decodeToken } = require("../middlewares/baseToken");

const prisma = new PrismaClient();

const getBinhLuanTheoIdAnh = async (req, res) => {
  try {
    let { idAnh } = req.params;

    let data = await prisma.binh_luan.findFirst({
      where: { hinh_id: +idAnh },
    });

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const postBinhLuan = async (req, res) => {
  try {
    let { token } = req.headers;
    let { idAnh, ngayLuu } = req.body;

    let idNguoiDung = decodeToken(token).data.nguoi_dung_id;

    let checkBinhLuan = await prisma.binh_luan.findFirst({
      where: { hinh_id: +idAnh, nguoi_dung_id: idNguoiDung },
    });

    if (checkBinhLuan) {
      failCode(res, "", "Bạn đã bình luận ảnh này rồi!");
    } else {
      await prisma.binh_luan.create({
        data: {
          nguoi_dung_id: idNguoiDung,
          hinh_id: +idAnh,
          ngay_binh_luan: new Date(ngayLuu),
        },
      });

      successCode(res, "", "Đăng bình luận thành công!");
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

module.exports = { getBinhLuanTheoIdAnh, postBinhLuan };
