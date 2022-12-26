const { PrismaClient } = require("@prisma/client");
const { successCode, errorCode, failCode } = require("../config/response");
const { decodeToken } = require("../middlewares/baseToken");
const fs = require("fs");

const prisma = new PrismaClient();

const getAnh = async (req, res) => {
  try {
    let data = await prisma.hinh_anh.findMany();

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const getAnhTheoTen = async (req, res) => {
  try {
    let { tenAnh } = req.params;

    let data = await prisma.hinh_anh.findMany({
      where: { ten_hinh: { contains: tenAnh } },
    });

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const getThongTinTheoIdAnh = async (req, res) => {
  try {
    let { idAnh } = req.params;

    let data = await prisma.hinh_anh.findUnique({
      where: { hinh_id: +idAnh },
      include: { nguoi_dung: true },
    });

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const getLuuAnhTheoIdAnh = async (req, res) => {
  try {
    let { idAnh } = req.params;
    let { token } = req.headers;

    let idNguoiDung = decodeToken(token).data.nguoi_dung_id;

    let checkAnh = await prisma.luu_anh.findFirst({
      where: {
        hinh_id: +idAnh,
        nguoi_dung_id: idNguoiDung,
      },
    });

    if (checkAnh) {
      successCode(res, true, "Ảnh đã được lưu!");
    } else {
      failCode(res, false, "Ảnh chưa được lưu!");
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const getAnhDaLuu = async (req, res) => {
  try {
    let { token } = req.headers;

    let idNguoiDung = decodeToken(token).data.nguoi_dung_id;

    let data = await prisma.luu_anh.findMany({
      where: { nguoi_dung_id: idNguoiDung },
      select: { hinh_id: true, ngay_luu: true, hinh_anh: true },
    });

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const getAnhDaTao = async (req, res) => {
  try {
    let { token } = req.headers;

    let idNguoiDung = decodeToken(token).data.nguoi_dung_id;

    let data = await prisma.hinh_anh.findMany({
      where: { nguoi_dung_id: idNguoiDung },
    });

    successCode(res, data, "Lấy dữ liệu thành công!");
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const handleCheckLuuAnh = async (idAnh) => {
  let checkLuuAnh = await prisma.luu_anh.findMany({
    where: { hinh_id: +idAnh },
  });

  return checkLuuAnh;
};

const handleCheckBinhLuan = async (idAnh) => {
  let checkBinhLuan = await prisma.binh_luan.findMany({
    where: { hinh_id: +idAnh },
  });

  return checkBinhLuan;
};

const deleteAnh = async (req, res) => {
  try {
    let { idAnh } = req.params;

    let checkAnh = await prisma.hinh_anh.findFirst({
      where: { hinh_id: +idAnh },
    });

    if (checkAnh) {
      if (handleCheckLuuAnh(idAnh)) {
        await prisma.luu_anh.deleteMany({ where: { hinh_id: +idAnh } });
      }

      if (handleCheckBinhLuan(idAnh)) {
        await prisma.binh_luan.deleteMany({ where: { hinh_id: +idAnh } });
      }

      await prisma.hinh_anh.delete({ where: { hinh_id: +idAnh } });

      successCode(res, "", "Xoá ảnh thành công!");
    } else {
      failCode(res, "", "Mã ảnh không tồn tại!");
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const uploadAnh = async (req, res) => {
  try {
    let { token } = req.headers;
    let { ten_hinh, mo_ta } = req.body;

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
          let dataBase = `data:${req.file.mimetype};base64,${Buffer.from(
            data
          ).toString("base64")}`;

          await prisma.hinh_anh.create({
            data: { ten_hinh, duong_dan: dataBase, mo_ta, nguoi_dung_id },
          });

          fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);

          successCode(res, "", "Đăng ảnh thành công!");
        }
      );
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

const postLuuAnh = async (req, res) => {
  try {
    let { hinh_id, ngay_luu } = req.body;
    let { token } = req.headers;

    let nguoi_dung_id = decodeToken(token).data.nguoi_dung_id;

    let checkAnh = await prisma.luu_anh.findFirst({
      where: {
        hinh_id,
        nguoi_dung_id,
      },
    });

    if (checkAnh) {
      failCode(res, "", "Ảnh đã được lưu!");
    } else {
      await prisma.luu_anh.create({
        data: { nguoi_dung_id, hinh_id, ngay_luu: new Date(ngay_luu) },
      });

      successCode(res, "", "Lưu ảnh thành công!");
    }
  } catch (err) {
    errorCode(res, "Lỗi BE!");
  }
};

module.exports = {
  getAnh,
  getAnhTheoTen,
  getThongTinTheoIdAnh,
  getLuuAnhTheoIdAnh,
  getAnhDaLuu,
  getAnhDaTao,
  deleteAnh,
  uploadAnh,
  postLuuAnh,
};
