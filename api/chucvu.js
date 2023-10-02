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
      .query(`SELECT * FROM chucvu WHERE _id = @_id`);
    let chucvu = result.recordset[0];
    if (chucvu) {
      await pool
        .request()
        .input('_id', req.params._id)
        .input("macv", req.body.macv)
        .input("chucvu", req.body.chucvu)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE chucvu SET 
              macv = @macv, 
              chucvu = @chucvu,
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

router.post("/addchucvu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("macv", req.body.macv)
      .input("chucvu", req.body.chucvu)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .query(`
                      INSERT INTO chucvu (macv, chucvu, ghichu, createdAt, createdBy) 
                      VALUES (@macv, @chucvu, @ghichu, @createdAt, @createdBy);
                  `);
    const chucvu = req.body;
    res.json(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data phong ban
router.get("/allchucvu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM chucvu`);
    const chucvu = result.recordset;

    res.json(chucvu);
    //console.log(chucvu);
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
      .query(`SELECT * FROM chucvu WHERE _id = @_id`);
    const chucvu = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (chucvu) {
      res.json(chucvu);
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
      .query(`SELECT * FROM chucvu WHERE _id = @_id`);
    let chucvu = result.recordset.length ? result.recordset[0] : null;
    if (chucvu) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM chucvu WHERE _id = @_id;`);
      res.json(chucvu);
    } else {
      res.status(404).json({
        message: "Không tìm thấy chức vụ này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;