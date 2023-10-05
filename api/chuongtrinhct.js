const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const multer = require("multer");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /* Nhớ sửa đường dẫn khi deploy lên máy chủ */
    //cb(null, "E:\\PROJECT\\docthuBhxh\\client\\static\\avatar");
    cb(null, "D:\\TUANPDA\\CODE_APP\\tvs\\tvshow-client\\static");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

// Add Data
router.post("/addlinhvuc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("noidung", req.body.noidung)
      .input("kehoach", req.body.kehoach)
      .input("dathuchien", req.body.dathuchien)
      .input("malinhvuc", req.body.malinhvuc)
      .input("linhvuc", req.body.linhvuc)
      .input("createdAt", req.body.createdAt)
      .input("istyle", req.body.istyle).query(`
                      INSERT INTO chuongtrinhct (noidung, kehoach, dathuchien, malinhvuc, linhvuc, createdAt, istyle) 
                      VALUES (@noidung, @kehoach, @dathuchien, @malinhvuc, @linhvuc, @createdAt, @istyle);
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

// Đẩy file
router.post("/uploadfile", upload.single("urlfile"), async (req, res) => {
  console.log(req);
});

// Update
router.patch("/linhvuc/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM chuongtrinhct WHERE _id = @_id`);
    let ctct = result.recordset[0];
    if (ctct) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("noidung", req.body.noidung)
        .input("kehoach", req.body.kehoach)
        .input("dathuchien", req.body.dathuchien)
        .input("istyle", req.body.istyle)
        .query(
          `UPDATE chuongtrinhct SET
              noidung = @noidung,
              kehoach =@kehoach,
              dathuchien = @dathuchien,
              istyle = @istyle
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

// Update ngay thang nam
router.patch("/thangnam/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM thangnam WHERE _id = @_id`);
    let thangnam = result.recordset[0];
    // console.log(req.body.updatedAt);
    if (thangnam) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("thang", req.body.thang)
        .input("nam", req.body.nam)
        .query(
          `UPDATE thangnam SET
              thang = @thang,
              nam =@nam
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

// Get Data
// Get all data
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

// Get all data linh vuc 1
router.get("/linhvuc1", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM chuongtrinhct where malinhvuc=1 order by createdAt desc`
      );
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all data linh vuc 2
router.get("/linhvuc2", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM chuongtrinhct where malinhvuc=2 order by createdAt desc`
      );
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all data linh vuc 3
router.get("/linhvuc3", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM chuongtrinhct where malinhvuc=3 order by createdAt desc`
      );
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all data linh vuc 4
router.get("/linhvuc4", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM chuongtrinhct where malinhvuc=4 order by createdAt desc`
      );
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get tháng
router.get("/thangnam", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM thangnam`);
    const data = result.recordset;
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Data
router.delete("/linhvuc/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM chuongtrinhct WHERE _id = @_id`);
    let ctct = result.recordset.length ? result.recordset[0] : null;
    if (ctct) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM chuongtrinhct WHERE _id = @_id;`);
      res.json(ctct);
    } else {
      res.status(404).json({
        message: "Không tìm thấy bản ghi",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
