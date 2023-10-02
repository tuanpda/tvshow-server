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
    //cb(null, "E:\\PROJECT\\docthuBhxh\\client\\static\\avatar");
    cb(null, "E:\\PROJECT\\TINHLUONGCONGDOAN\\client\\static\\avatar");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.patch("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM sanpham WHERE _id = @_id`);
    let sanpham = result.recordset[0];
    if (sanpham) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("masp", req.body.masp)
        .input("tensp", req.body.tensp)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE sanpham SET 
                        masp = @masp, 
                        tensp = @tensp,
                        ghichu = @ghichu,
                        updatedAt = @updatedAt
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

router.post("/addsanpham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masp", req.body.masp)
      .input("tensp", req.body.tensp)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO sanpham (masp, tensp, ghichu, createdAt, createdBy) 
                      VALUES (@masp, @tensp, @ghichu, @createdAt, @createdBy);
                  `);
    const sanpham = req.body;
    res.json(sanpham);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data phong ban
router.get("/allsanpham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM dmvt`);
    const sanpham = result.recordset;

    res.json(sanpham);
    //console.log(sanpham);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all sanpham
router.get("/getallsp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM sanpham`);
    const sanpham = result.recordset;

    res.json(sanpham);
    //console.log(sanpham);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all sanpham theo mã px
router.get("/getallspwithmapx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      // .input("mapx", req.query.mapx)
      .query(`SELECT * FROM sanpham order by mapx`);
    const px = result.recordset;

    res.json(px);
    //console.log(sanpham);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all sanpham lấy từ bảng nguyên công
router.get("/getallspfromdmnc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM dmnc order by mapx`);
    const px = result.recordset;

    res.json(px);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all sanpham theo mã px lấy từ bảng nguyên công
router.get("/getallspwithmapxfromdmnc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`SELECT * FROM dmnc where mapx=@mapx`);
    const px = result.recordset;

    res.json(px);
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
      .query(`SELECT * FROM sanpham WHERE _id = @_id`);
    const sanpham = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (sanpham) {
      res.json(sanpham);
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
      .query(`SELECT * FROM sanpham WHERE _id = @_id`);
    let sanpham = result.recordset.length ? result.recordset[0] : null;
    if (sanpham) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM sanpham WHERE _id = @_id;`);
      res.json(sanpham);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
