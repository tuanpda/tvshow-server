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
      .query(`SELECT * FROM phongban WHERE _id = @_id`);
    let phongban = result.recordset[0];
    if (phongban) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("maphong", req.body.maphong)
        .input("tenphong", req.body.tenphong)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE phongban SET 
              maphong = @maphong, 
              tenphong = @tenphong,
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

// update công nhật
router.patch("/congnhat/:_id", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM dmcongnhat WHERE _id = @_id`);
    let congnhat = result.recordset[0];
    if (congnhat) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("macn", req.body.macn)
        .input("tencn", req.body.tencn)
        .input("dongia", req.body.dongia)
        .input("loailuong", req.body.loailuong)
        .input("loaiphanbo", req.body.loaiphanbo)
        .input("ghichu", req.body.ghichu)
        .input("updatedBy", req.body.updatedBy)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE dmcongnhat SET 
              macn = @macn, 
              tencn = @tencn,
              dongia = @dongia, 
              loailuong = @loailuong,
              loaiphanbo = @loaiphanbo,
              ghichu = @ghichu,
              updatedBy = @updatedBy,
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

router.patch("/phanxuong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM phanxuong WHERE _id = @_id`);
    let phanxuong = result.recordset[0];
    if (phanxuong) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("mapx", req.body.mapx)
        .input("tenpx", req.body.tenpx)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE phanxuong SET 
              mapx = @mapx, 
              tenpx = @tenpx,
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

router.patch("/bophan/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM bophan WHERE _id = @_id`);
    let bophan = result.recordset[0];
    if (bophan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("mabp", req.body.mabp)
        .input("tenbp", req.body.tenbp)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE bophan SET 
              mabp = @mabp, 
              tenbp = @tenbp,
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

router.patch("/tonhom/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM tonhom WHERE _id = @_id`);
    let tonhom = result.recordset[0];
    if (tonhom) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("mapx", req.body.mapx)
        .input("tenpx", req.body.tenpx)
        .input("mato", req.body.mato)
        .input("tento", req.body.tento)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE tonhom SET 
              mapx = @mapx, 
              tenpx = @tenpx,
              mato = @mato,
              tento = @tento,
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

router.post("/addphongban", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maphong", req.body.maphong)
      .input("tenphong", req.body.tenphong)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO phongban (maphong, tenphong, ghichu, createdAt, createdBy) 
                      VALUES (@maphong, @tenphong, @ghichu, @createdAt, @createdBy);
                  `);
    const phongban = req.body;
    res.json(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// add công nhật
router.post("/addcongnhat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("macn", req.body.macn)
      .input("tencn", req.body.tencn)
      .input("dongia", req.body.dongia)
      .input("loailuong", req.body.loailuong)
      .input("loaiphanbo", req.body.loaiphanbo)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO dmcongnhat (macn, tencn, dongia, loailuong, loaiphanbo, ghichu, createdAt, createdBy) 
                      VALUES (@macn, @tencn, @dongia, @loailuong, @loaiphanbo, @ghichu, @createdAt, @createdBy);
                  `);

    res.json({
      success: true,
      message: "Add success !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addphanxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO phanxuong (mapx, tenpx, ghichu, createdAt, createdBy) 
                      VALUES (@mapx, @tenpx, @ghichu, @createdAt, @createdBy);
                  `);
    const phanxuong = req.body;
    res.json(phanxuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addbophan", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mabp", req.body.mabp)
      .input("tenbp", req.body.tenbp)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO bophan (mabp, tenbp, ghichu, createdAt, createdBy) 
                      VALUES (@mabp, @tenbp, @ghichu, @createdAt, @createdBy);
                  `);
    const bophan = req.body;
    res.json(bophan);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO tonhom (mapx, tenpx, mato, tento, ghichu, createdAt, createdBy) 
                      VALUES (@mapx, @tenpx, @mato, @tento, @ghichu, @createdAt, @createdBy);
                  `);
    const to = req.body;
    res.json(to);
  } catch (error) {
    res.status(500).json(error);
  }
});

// add cấp bậc lương
router.post("/addcapbacluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nhom", req.body.nhom)
      .input("maso", req.body.maso)
      .input("diengiai", req.body.diengiai)
      .input("lcbmax", req.body.lcbmax)
      .input("lcbmin", req.body.lcbmin)
      .input("phucapmax", req.body.phucapmax)
      .input("phucapmin", req.body.phucapmin)
      .input("ghichu1", req.body.ghichu1)
      .input("ghichu2", req.body.ghichu2)
      .input("ghichu3", req.body.ghichu3)
      .input("createdBy", req.body.createdBy)
      .input("createdAt", req.body.createdAt).query(`
                      INSERT INTO capbacluong (nhom, maso, diengiai, lcbmax, lcbmin, phucapmax, phucapmin, ghichu1, ghichu2, ghichu3, createdBy, createdAt) 
                      VALUES (@nhom, @maso, @diengiai, @lcbmax, @lcbmin, @phucapmax, @phucapmin, @ghichu1, @ghichu2, @ghichu3, @createdBy, @createdAt);
                  `);
    const to = req.body;
    res.json(to);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data phong ban
router.get("/allphongban", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM phongban`);
    const phongban = result.recordset;

    res.json(phongban);
    //console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data bộ phận
router.get("/allbophan", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM bophan`);
    const bp = result.recordset;

    res.json(bp);
    //console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all danh mục công nhật
router.get("/alldmcongnhat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM dmcongnhat`);
    const bp = result.recordset;

    res.json(bp);
    //console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phân xưởng
router.get("/allphanxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM phanxuong order by mapx`);
    const phongban = result.recordset;

    res.json(phongban);
    //console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all tổ
router.get("/allto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM tonhom order by mapx`);
    const tonhom = result.recordset;
    res.json(tonhom);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get tổ theo mã phân xưởng
router.get("/alltoinxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`SELECT * FROM tonhom where mapx=@mapx`);
    const tonhom = result.recordset;
    res.json(tonhom);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get sản phẩm theo mã px
router.get("/getdmspvt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`SELECT * FROM dmvt where mapx=@mapx`);
    const phongban = result.recordset;

    res.json(phongban);
    //console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get sản phẩm
router.get("/getdmsp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM dmvt`);
    const sp = result.recordset;

    res.json(sp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get nhóm lương từ mã sp
router.get("/getnhomluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masp", req.query.masp)
      .query(`SELECT nhomluong FROM dmvt where masp=@masp`);
    const phongban = result.recordset;

    res.json(phongban);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phòng ban
router.get("/getallphongban", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masp", req.query.masp)
      .query(`SELECT * from phongban`);
    const phongban = result.recordset;

    res.json(phongban);
    // console.log(phongban);
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
      .query(`SELECT * FROM phongban WHERE _id = @_id`);
    const phongban = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (phongban) {
      res.json(phongban);
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

// get by id
router.get("/bophan/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM bophan WHERE _id = @_id`);
    const bophan = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (bophan) {
      res.json(bophan);
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

// get by id
router.get("/tonhom/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM tonhom WHERE _id = @_id`);
    const tonhom = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (tonhom) {
      res.json(tonhom);
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get by id phân xưởng
router.get("/phanxuong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM phanxuong WHERE _id = @_id`);
    const phanxuong = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (phanxuong) {
      res.json(phanxuong);
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
      .query(`SELECT * FROM phongban WHERE _id = @_id`);
    let phongban = result.recordset.length ? result.recordset[0] : null;
    if (phongban) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM phongban WHERE _id = @_id;`);
      res.json(phongban);
    } else {
      res.status(404).json({
        message: "Không tìm thấy phòng ban này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/phanxuong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM phanxuong WHERE _id = @_id`);
    let phanxuong = result.recordset.length ? result.recordset[0] : null;
    if (phanxuong) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM phanxuong WHERE _id = @_id;`);
      res.json(phanxuong);
    } else {
      res.status(404).json({
        message: "Không tìm thấy phân xưởng này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/tonhom/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM tonhom WHERE _id = @_id`);
    let phanxuong = result.recordset.length ? result.recordset[0] : null;
    if (phanxuong) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM tonhom WHERE _id = @_id;`);
      res.json(phanxuong);
    } else {
      res.status(404).json({
        message: "Không tìm thấy phân xưởng này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/bophan/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM bophan WHERE _id = @_id`);
    let bophan = result.recordset.length ? result.recordset[0] : null;
    if (bophan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM bophan WHERE _id = @_id;`);
      res.json(bophan);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/congnhat/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM dmcongnhat WHERE _id = @_id`);
    let cn = result.recordset.length ? result.recordset[0] : null;
    if (cn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM dmcongnhat WHERE _id = @_id;`);
      res.json({
        success: true,
        message: "Delete success !",
      });
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
