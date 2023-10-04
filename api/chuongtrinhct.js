const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");

// router.patch("/:_id", async (req, res) => {
//   try {
//     await pool.connect();
//     const result = await pool
//       .request()
//       .input("_id", req.params._id)
//       .query(`SELECT * FROM nhanvien WHERE _id = @_id`);
//     let nhanvien = result.recordset[0];
//     // console.log(req.body.updatedAt);
//     if (nhanvien) {
//       await pool
//         .request()
//         .input("_id", req.params._id)
//         .input("tennv", req.body.tennv)
//         .input("mapb", req.body.mapb)
//         .input("makhoi", req.body.makhoi)
//         .input("tenkhoi", req.body.tenkhoi)
//         .input("tenphong", req.body.tenphong)
//         .query(
//           `UPDATE nhanvien SET
//               tennv = @tennv,
//               mapb =@mapb,
//               makhoi = @makhoi,
//               tenkhoi = @tenkhoi,
//               WHERE _id = @_id;`
//         );
//       res.json({
//         success: true,
//         message: "Update success !",
//       });
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

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

router.post("/addchuongtrinhct", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("noidung", req.body.noidung)
      .input("kehoach", req.body.kehoach)
      .input("dathuchien", req.body.dathuchien)
      .input("createdBy", req.body.createdBy)
      .input("createdAt", req.body.createdAt).query(`
                      INSERT INTO chuongtrinhct (noidung, kehoach, dathuchien, createdBy, createdAt) 
                      VALUES (@noidung, @kehoach, @dathuchien, @createdBy, @createdAt);
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

// delete api by id
router.delete("/:_id", async (req, res) => {
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
