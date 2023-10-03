const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");

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

router.post("/addchuongtrinhct", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("noidung", req.body.noidung)
      .input("kehoach", req.body.kehoach)
      .input("dangthuchien", req.body.dangthuchien)
      .input("dathuchien", req.body.dathuchien)
      .input("createdBy", req.body.createdBy)
      .input("createdAt", req.body.createdAt).query(`
                      INSERT INTO chuongtrinhct (noidung, kehoach, dangthuchien, dathuchien, createdBy, createdAt) 
                      VALUES (@noidung, @kehoach, @dangthuchien, @dathuchien, @createdBy, @createdAt);
                  `);
    const chuongtrinhct = req.body;
    res.json({
      data: chuongtrinhct,
      success: true,
      message: "add success!",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data
router.get("/", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM chuongtrinhct order by createdAt desc`);
    const data = result.recordset;
    res.json(data);
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
