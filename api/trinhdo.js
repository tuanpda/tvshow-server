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
      .query(`SELECT * FROM trinhdo WHERE _id = @_id`);
    let trinhdo = result.recordset[0];
    if (trinhdo) {
      await pool
        .request()
        .input('_id', req.params._id)
        .input("matrinhdo", req.body.matrinhdo)
        .input("trinhdo", req.body.trinhdo)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE trinhdo SET 
              matrinhdo = @matrinhdo, 
              trinhdo = @trinhdo,
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

router.post("/addtrinhdo", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matrinhdo", req.body.matrinhdo)
      .input("trinhdo", req.body.trinhdo)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .query(`
                      INSERT INTO trinhdo (matrinhdo, trinhdo, ghichu, createdAt, createdBy) 
                      VALUES (@matrinhdo, @trinhdo, @ghichu, @createdAt, @createdBy);
                  `);
    const trinhdo = req.body;
    res.json(trinhdo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data phong ban
router.get("/alltrinhdo", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM trinhdo`);
    const trinhdo = result.recordset;

    res.json(trinhdo);
    //console.log(trinhdo);
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
      .query(`SELECT * FROM trinhdo WHERE _id = @_id`);
    const trinhdo = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (trinhdo) {
      res.json(trinhdo);
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
      .query(`SELECT * FROM trinhdo WHERE _id = @_id`);
    let trinhdo = result.recordset.length ? result.recordset[0] : null;
    if (trinhdo) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM trinhdo WHERE _id = @_id;`);
      res.json(trinhdo);
    } else {
      res.status(404).json({
        message: "Không tìm thấy trình độ này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;