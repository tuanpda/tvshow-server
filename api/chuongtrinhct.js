const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");

// Add Data
// Add linh vuc 1
router.post("/addlinhvuc1", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("noidung", req.body.noidung)
      .input("kehoach", req.body.kehoach)
      .input("dathuchien", req.body.dathuchien)
      .input("malinhvuc", req.body.malinhvuc)
      .input("linhvuc", req.body.linhvuc)
      .input("createdAt", req.body.createdAt).query(`
                      INSERT INTO chuongtrinhct (noidung, kehoach, dathuchien, malinhvuc, linhvuc, createdAt) 
                      VALUES (@noidung, @kehoach, @dathuchien, @malinhvuc, @linhvuc, @createdAt);
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

// Add linh vuc 2
router.post("/addlinhvuc2", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("noidung", req.body.noidung)
      .input("kehoach", req.body.kehoach)
      .input("dathuchien", req.body.dathuchien)
      .input("malinhvuc", req.body.malinhvuc)
      .input("linhvuc", req.body.linhvuc)
      .input("createdAt", req.body.createdAt).query(`
                      INSERT INTO chuongtrinhct (noidung, kehoach, dathuchien, malinhvuc, linhvuc, createdAt) 
                      VALUES (@noidung, @kehoach, @dathuchien, @malinhvuc, @linhvuc, @createdAt);
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

// Update
// Update linh vuc 1
router.patch("/linhvuc1/:_id", async (req, res) => {
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
        .query(
          `UPDATE chuongtrinhct SET
              noidung = @noidung,
              kehoach =@kehoach,
              dathuchien = @dathuchien
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
// Delete api by id
router.delete("/linhvuc1/:_id", async (req, res) => {
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
