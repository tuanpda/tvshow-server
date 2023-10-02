const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database/dbinfo");
const jwt = require("jsonwebtoken");
const verifyToken = require("../services/verify-token");
const multer = require("multer");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /* Nhớ sửa đường dẫn khi deploy lên máy chủ */
    // cb(null, "D:\\CODE\\PROJECT\\client\\static\\avatar");
    cb(null, "E:\\CODE_APP\\TEAMGIT\\client\\static\\anhdd\\nhanvien");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.patch("/:_id", upload.single("anhdd"), async (req, res) => {
  let linkAvatar;
  if (!req.file) {
    linkAvatar = req.body.anhdd;
  } else {
    linkAvatar = `http://toanluc.online/anhdd/nhanvien/${req.file.filename}`;
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM nhanvien WHERE _id = @_id`);
    let nhanvien = result.recordset[0];
    // console.log(req.body.updatedAt);
    if (nhanvien) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("tennv", req.body.tennv)
        .input("mapb", req.body.mapb)
        .input("makhoi", req.body.makhoi)
        .input("tenkhoi", req.body.tenkhoi)
        .input("tenphong", req.body.tenphong)
        .input("sodienthoai", req.body.sodienthoai)
        .input("cccd", req.body.cccd)
        .input("anhdd", linkAvatar)
        .input("ngaysinh", req.body.ngaysinh)
        .input("gioitinh", req.body.gioitinh)
        .input("mucluong", req.body.mucluong)
        .input("lhkhancap", req.body.lhkhancap)
        .input("diachilh", req.body.diachilh)
        .input("sotknh", req.body.sotknh)
        .input("tennh", req.body.tennh)
        .input("diengiai", req.body.diengiai)
        .input("trangthai", req.body.trangthai)
        .input("updatedAt", req.body.updatedAt)
        .input("chutaikhoan", req.body.chutaikhoan)
        .query(
          `UPDATE nhanvien SET 
              tennv = @tennv,
              mapb =@mapb,
              makhoi = @makhoi,
              tenkhoi = @tenkhoi,
              tenphong = @tenphong,
              sodienthoai = @sodienthoai,
              cccd = @cccd,
              anhdd = @anhdd,
              ngaysinh = @ngaysinh,
              gioitinh = @gioitinh,
              mucluong = @mucluong,
              lhkhancap = @lhkhancap,
              diachilh = @diachilh,
              sotknh = @sotknh,
              tennh = @tennh,
              diengiai = @diengiai,
              trangthai = @trangthai,
              updatedAt = @updatedAt,
              chutaikhoan = @chutaikhoan
              WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// update status
router.patch("/updatetrangthainhanvien/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM nhanvien WHERE _id = @_id`);
    let nv = result.recordset[0];
    if (nv) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("trangthai", req.body.trangthai)
        .input("diengiai", req.body.diengiai)
        .query(
          `UPDATE nhanvien SET 
                trangthai = @trangthai, 
                diengiai = @diengiai
                WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật lương cơ bản
router.patch("/luongcoban/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM nhanvien WHERE _id = @_id`);
    let nhanvien = result.recordset[0];
    if (nhanvien) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("mucluong", req.body.mucluong)
        .input("luongngay", req.body.luongngay)
        .input("bacluong", req.body.bacluong)
        .input("luongtrachnhiem", req.body.luongtrachnhiem)
        .query(
          `UPDATE nhanvien SET 
              mucluong = @mucluong,
              luongngay =@luongngay,
              bacluong = @bacluong,
              luongtrachnhiem = @luongtrachnhiem
              WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addnhanvien", upload.single("anhdd"), async (req, res) => {
  let linkAvatar;
  const file = req.file;
  if (!file) {
    anhdd = req.body.anhdd;
  } else {
    // Đổi đường dẫn khi deploy lên máy chủ
    linkAvatar = `http://toanluc.online/anhdd/nhanvien/anhdaidien_default.jpg`;
  }

  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("manv", req.body.manv)
      .input("tennv", req.body.tennv)
      .input("mapb", req.body.mapb)
      .input("makhoi", req.body.makhoi)
      .input("tenkhoi", req.body.tenkhoi)
      .input("tenphong", req.body.tenphong)
      .input("sodienthoai", req.body.sodienthoai)
      .input("cccd", req.body.cccd)
      .input("anhdd", linkAvatar)

      .input("ngaysinh", req.body.ngaysinh)
      .input("gioitinh", req.body.gioitinh)
      .input("mucluong", req.body.mucluong)
      .input("lhkhancap", req.body.lhkhancap)
      .input("diachilh", req.body.diachilh)
      .input("sotknh", req.body.sotknh)
      .input("tennh", req.body.tennh)

      .input("diengiai", req.body.diengiai)
      .input("createdAt", req.body.createdAt)
      .input("accadd", req.body.accadd)
      .input("thuong", req.body.thuong)
      .input("dt_dieuchinh", req.body.dt_dieuchinh)
      .input("dt_thuong", req.body.dt_thuong)
      .input("dt_phat", req.body.dt_phat)
      .input("luongngoaih", req.body.luongngoaih)
      .input("luongngay", req.body.luongngay)
      .input("bacluong", req.body.bacluong)
      .input("luongtrachnhiem", req.body.luongtrachnhiem)
      .input("congdoan", req.body.congdoan)
      .input("trangthai", req.body.trangthai)
      .input("chutaikhoan", req.body.chutaikhoan)
      .input("phucaptn", req.body.phucaptn)
      .input("luongphatsinh", req.body.luongphatsinh)
      .input("thuongdoanhthu", req.body.thuongdoanhthu)
      .input("ngaycong", req.body.ngaycong)
      .input("luongthemgio", req.body.luongthemgio)
      .input("sogiongoaigio", req.body.sogiongoaigio)
      .input("sogiongoaigiochunhat", req.body.sogiongoaigiochunhat).query(`
                      INSERT INTO nhanvien (manv, tennv, mapb, makhoi, tenkhoi, tenphong, sodienthoai, cccd, anhdd, ngaysinh, gioitinh, mucluong, 
                        lhkhancap, diachilh, sotknh, tennh, diengiai, createdAt, accadd, thuong, dt_dieuchinh, dt_thuong, dt_phat, luongngoaih, luongngay, bacluong, 
                        luongtrachnhiem, congdoan, trangthai, chutaikhoan, phucaptn, luongphatsinh, thuongdoanhthu, ngaycong, luongthemgio, sogiongoaigio, sogiongoaigiochunhat) 
                      VALUES (@manv, @tennv, @mapb, @makhoi, @tenkhoi, @tenphong, @sodienthoai, @cccd, @anhdd, @ngaysinh, @gioitinh, @mucluong, 
                        @lhkhancap, @diachilh, @sotknh, @tennh, @diengiai, @createdAt, @accadd, @thuong, @dt_dieuchinh, @dt_thuong, @dt_phat, @luongngoaih, @luongngay, @bacluong, 
                        @luongtrachnhiem, @congdoan, @trangthai, @chutaikhoan, @phucaptn, @luongphatsinh, @thuongdoanhthu, @ngaycong, @luongthemgio, @sogiongoaigio, @sogiongoaigiochunhat);
                  `);
    const nhanvien = req.body;
    // res.json(nhanvien);
    res.json({
      data: nhanvien,
      success: true,
      message: "add success!",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data nhanvien
router.get("/", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM nhanvien order by makhoi, mapb`);
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data nhanvien status
router.get("/statusnhanvien1", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM nhanvien where trangthai=1 order by mapb`);
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data nhanvien status and with makhoi
router.get("/statusnhanvien1withmakhoi", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makhoi", req.query.makhoi)
      .query(
        `SELECT * FROM nhanvien where trangthai=1 and makhoi=@makhoi order by mapb`
      );
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// công nhân đã nghỉ việc
router.get("/allnhanviennghiviec", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query("select * from nhanvien where trangthai=0 order by _id desc");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data nhóm mpb
router.get("/reportnhansu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM nhanvien order by mapb`);
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all nhan vien by maphong
router.get("/getallnhanvien", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapb", req.query.mapb)
      .query(`SELECT * FROM nhanvien where mapb=@mapb`);
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all nhan vien by khối
router.get("/getallnhanvienmakhoi", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makhoi", req.query.makhoi)
      .query(`SELECT * FROM nhanvien where makhoi=@makhoi order by mapb`);
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get nhan vien by ccd
router.get("/getcccd", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("cccd", req.query.cccd)
      .query(`SELECT * FROM nhanvien where cccd=@cccd`);
    const nv = result.recordset;

    res.json(nv);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get by id
router.get("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM nhanvien WHERE _id = @_id`);
    const nhanvien = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (nhanvien) {
      res.json(nhanvien);
      //console.log(t)
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete api by id
router.delete("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM nhanvien WHERE _id = @_id`);
    let nhanvien = result.recordset.length ? result.recordset[0] : null;
    if (nhanvien) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM nhanvien WHERE _id = @_id;`);
      res.json(nhanvien);
    } else {
      res.status(404).json({
        message: "Không tìm thấy nhân viên này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
