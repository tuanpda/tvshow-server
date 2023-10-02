const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database/dbinfo");
const jwt = require("jsonwebtoken");
const verifyToken = require("../services/verify-token");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const {
  ConnectionPool,
  Table,
  NVarChar,
  NChar,
  Int,
  rows,
  Date,
  DateTime,
  Bit,
} = require("mssql");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /* Nhớ sửa đường dẫn khi deploy lên máy chủ */
    //cb(null, "E:\\PROJECT\\docthuBhxh\\client\\static\\avatar");
    // E:\CODE_APP\TEAMGIT\server\filesupload
    // cb(null, "D:\\CODE\\TEAMGIT\\server\\filesupload"); // offline
    cb(null, "E:\\CODE_APP\\TEAMGIT\\server\\filesupload"); // server
  },
  filename: function (req, file, cb) {
    cb(null, "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

// cập nhật kế hoạch NHÀ MÁY
router.patch("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("makhpx", req.body.makhpx)
        .input("soluong", req.body.soluong)
        .input("ngaybd", req.body.ngaybd)
        .input("ngaykt", req.body.ngaykt)
        .input("tuanbd", req.body.tuanbd)
        .input("tuankt", req.body.tuankt)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE lokehoach SET 
                        makhpx = @makhpx, 
                        soluong = @soluong,
                        ngaybd = @ngaybd, 
                        ngaykt = @ngaykt,
                        tuanbd = @tuanbd, 
                        tuankt = @tuankt,
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

// cập nhật kế hoạch NĂM
router.patch("/kehoachnam/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM kehoach WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("tgbatdau", req.body.tgbatdau)
        .input("tgketthuc", req.body.tgketthuc)
        .input("soluong", req.body.soluong)
        .input("soluongmuavup1", req.body.soluongmuavup1)
        .input("soluongmuavup2", req.body.soluongmuavup2)
        .input("soluongmuavup3", req.body.soluongmuavup3)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE kehoach SET 
                        tgbatdau = @makhpx, 
                        tgketthuc = @soluong,
                        soluong = @ngaybd, 
                        soluongmuavup1 = @ngaykt,
                        soluongmuavup2 = @soluongmuavup2,
                        soluongmuavup3 = @soluongmuavup3,
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

// cập nhật lo kế hoạch tại phân xưởng tại chức năng lapkehoachlophanxuong
router.patch("/lokehoachphanxuong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("makhpx", req.body.makhpx)
        .input("soluongkhpx", req.body.soluongkhpx)
        .input("ngaybdkhpx", req.body.ngaybdkhpx)
        .input("ngayktkhpx", req.body.ngayktkhpx)
        .input("updatedAt", req.body.updatedAt)
        .input("congsuat", req.body.congsuat)
        .input("songay", req.body.songay)
        .input("may", req.body.may)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        makhpx = @makhpx, 
                        soluongkhpx = @soluongkhpx,
                        ngaybdkhpx = @ngaybdkhpx, 
                        ngayktkhpx = @ngayktkhpx,
                        updatedAt = @updatedAt,
                        congsuat = @congsuat,
                        songay = @songay,
                        may = @may
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

// cập nhật lo kế hoạch tại phân xưởng tại chức năng dangkylokhphanxuong
router.patch("/updatelokehoachpx/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("makhpx", req.body.makhpx)
        .input("soluongkhpx", req.body.soluongkhpx)
        .input("ngaybdkhpx", req.body.ngaybdkhpx) // sửa lại code
        .input("ngayktkhpx", req.body.ngayktkhpx)
        .input("tuanbdkhpx", req.body.tuanbdkhpx)
        .input("tuanktkhpx", req.body.tuanktkhpx)
        .input("ttqt", req.body.ttqt)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        makhpx = @makhpx, 
                        soluongkhpx = @soluongkhpx,
                        ngaybdkhpx = @ngaybdkhpx,
                        ngayktkhpx = @ngayktkhpx,
                        tuanbdkhpx = @tuanbdkhpx,
                        tuanktkhpx = @tuanktkhpx,
                        ttqt = @ttqt,
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

// cập nhật lo kế hoạch tại phân xưởng tại chức năng dangkylokhphanxuong
router.patch("/updatelokehoachpxatdangkylodesanxuat/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("status", req.body.status)
        .input("tuanexc", req.body.tuanexc)
        .input("ngaybdexc", req.body.ngaybdexc)
        .input("ngayktexc", req.body.ngayktexc)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        status = @status, 
                        tuanexc = @tuanexc,
                        ngaybdexc = @ngaybdexc,
                        ngayktexc = @ngayktexc,
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

// cập nhật status Lô nhà máy
router.get("/updatestatuslonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makhpx", req.query.makhpx)
      .input("status", req.query.status)
      .query(`update lokehoach set status=@status where makhpx=@makhpx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật status = 3 và ngayketthucthucte cho lô kế hoạch
router.patch("/updatestatusngayhoanthanhtt/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("status", req.body.status)
        .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        status = @status, 
                        ngayhoanthanhtt = @ngayhoanthanhtt
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

// cập nhật kế hoạch nhà máy anchor
router.patch("/kehoach/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM kehoach WHERE _id = @_id`);
    let kehoach = result.recordset[0];
    if (kehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("tgbatdau", req.body.tgbatdau)
        .input("tgketthuc", req.body.tgketthuc)
        .input("soluongmuavup1", req.body.soluongmuavup1)
        .input("soluongmuavup2", req.body.soluongmuavup2)
        .input("soluongmuavup3", req.body.soluongmuavup3)
        .input("soluong", req.body.soluong)
        .input("slthang1", req.body.slthang1)
        .input("slthang2", req.body.slthang2)
        .input("slthang3", req.body.slthang3)
        .input("slthang4", req.body.slthang4)
        .input("slthang5", req.body.slthang5)
        .input("slthang6", req.body.slthang6)
        .input("slthang7", req.body.slthang7)
        .input("slthang8", req.body.slthang8)
        .input("slthang9", req.body.slthang9)
        .input("slthang10", req.body.slthang10)
        .input("slthang11", req.body.slthang11)
        .input("slthang12", req.body.slthang12)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE kehoach SET 
                        tgbatdau = @tgbatdau,
                        tgketthuc = @tgketthuc,
                        soluongmuavup1 = @soluongmuavup1, 
                        soluongmuavup2 = @soluongmuavup2,
                        soluongmuavup3 = @soluongmuavup3,
                        soluong = @soluong,
                        slthang1 = @slthang1,
                        slthang2 = @slthang2,
                        slthang3 = @slthang3,
                        slthang4 = @slthang4,
                        slthang5 = @slthang5,
                        slthang6 = @slthang6,
                        slthang7 = @slthang7,
                        slthang8 = @slthang8,
                        slthang9 = @slthang9,
                        slthang10 = @slthang10,
                        slthang11 = @slthang11,
                        slthang12 = @slthang12,                        
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

router.patch("/phieulo/:makh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.params.makh)
      .query(`SELECT * FROM lokehoach WHERE makh = @makh`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("makh", req.params.makh)
        .input("tgbatdau", req.body.tgbatdau)
        .input("tgketthuc", req.body.tgketthuc)
        .input("soluong", req.body.soluong)
        .input("updatedAt", req.body.updatedAt)
        .input("status", req.body.status)
        .query(
          `UPDATE kehoach SET 
                        tgbatdau = @tgbatdau, 
                        tgketthuc = @tgketthuc,
                        soluong = @soluong,
                        updatedAt = @updatedAt,
                        status = @status
                        WHERE makh = @makh;`
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

// update lô sản xuất
router.patch("/losanxuat/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("malonhamay", req.body.malonhamay)
        .input("makhpx", req.body.makhpx)
        .input("malosx", req.body.malosx)
        .input("mapx", req.body.mapx)
        .input("tenpx", req.body.tenpx)
        .input("mato", req.body.mato)
        .input("tento", req.body.tento)
        .input("masp", req.body.masp)
        .input("tensp", req.body.tensp)
        .input("soluong", req.body.soluong)
        .input("nhomluong", req.body.nhomluong)
        .input("soluonglsx", req.body.soluonglsx)
        .input("soluongkhsx", req.body.soluongkhsx)
        .input("ngaybd", req.body.ngaybd)
        .input("ngaykt", req.body.ngaykt)
        .input("updatedAt", req.body.updatedAt)
        .input("status", req.body.status)
        .input("datinhluong", req.body.datinhluong)
        .input("stopday_losx", req.body.stopday_losx)
        .query(
          `UPDATE losanxuat SET 
          malonhamay = @malonhamay, 
                        makhpx = @makhpx,
                        malosx = @malosx,
                        mapx = @mapx,
                        tenpx = @tenpx, 
                        mato = @mato,
                        tento = @tento,
                        masp = @masp,
                        tensp = @tensp, 
                        soluong = @soluong,
                        nhomluong = @nhomluong,
                        soluonglsx = @soluonglsx,
                        soluongkhsx = @soluongkhsx, 
                        ngaybd = @ngaybd,
                        ngaykt = @ngaykt,
                        updatedAt = @updatedAt,
                        datinhluong = @datinhluong,
                        stopday_losx = @stopday_losx,
                        status = @status
                        WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
      // console.log(res);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// update ngày bt ngày kt và status của lô sản xuất
router.patch("/losanxuat/status/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("ngaybd", req.body.ngaybd)
        .input("ngaykt", req.body.ngaykt)
        .input("updatedAt", req.body.updatedAt)
        .input("status", req.body.status)
        .input("soluongkhsx", req.body.soluongkhsx)
        .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
        .query(
          `UPDATE losanxuat SET 
                        ngaybd = @ngaybd,
                        ngaykt = @ngaykt,
                        updatedAt = @updatedAt,
                        status = @status,
                        soluongkhsx = @soluongkhsx,
                        ngayhoanthanhtt = @ngayhoanthanhtt
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

// update ngày hoàn thành thực tế và status của lô sản xuất
router.patch("/losanxuat/statusandngayhttt/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("status", req.body.status)
        .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
        .query(
          `UPDATE losanxuat SET 
                        status = @status,
                        ngayhoanthanhtt = @ngayhoanthanhtt
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

// update số lượng cập nhật nhanh và status cho lsx
router.patch("/losanxuat/soluongcnnandststus/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("status", req.body.status)
        .input("soluongkhsx", req.body.soluongkhsx)
        .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
        .query(
          `UPDATE losanxuat SET 
                        status = @status,
                        soluongkhsx = @soluongkhsx,
                        ngayhoanthanhtt = @ngayhoanthanhtt
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

// update mato
router.patch("/updatemato/:malonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("malonhamay", req.params.malonhamay)
      .query(
        `SELECT * FROM losanxuat WHERE malonhamay = @malonhamay and mapx='PXGC'`
      );
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("malonhamay", req.params.malonhamay)
        .input("mato", req.body.mato)
        .input("tento", req.body.tento)
        .query(
          `UPDATE losanxuat SET 
                        mato = @mato,
                        tento = @tento
                        WHERE malonhamay = @malonhamay;`
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
router.get("/laydanhsachmlnm", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT distinct(malonhamay) FROM losanxuat where mapx='PXGC'`);
    const lokehoach = result.recordset;
    console.log(lokehoach);

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/laydsmatotento", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("malonhamay", req.query.malonhamay)
      .query(
        `SELECT _id, mato, tento FROM lokehoachphanxuong where malonhamay=@malonhamay and mapx='PXGC'`
      );
    const lokehoach = result.recordset;
    console.log(lokehoach);

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update ngày hoàn thành thực tế
router.patch("/losanxuat/updatengayhttt/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
        .query(
          `UPDATE losanxuat SET 
          ngayhoanthanhtt = @ngayhoanthanhtt
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

// update trạng thái của lô kế hoạch thành sản xuất
router.patch("/lokehoach/status2/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        status = 2
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

// update stt chọn trong bảng cong nhân
router.patch("/congnhan/sttchon/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhan WHERE _id = @_id`);
    let cn = result.recordset[0];
    if (cn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("sttchon", req.body.sttchon)
        .query(
          `UPDATE congnhan SET 
              sttchon = @sttchon
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

// update trạng thái của lô kế hoạch thành đăng ký
router.patch("/lokehoach/status1/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        status = 1
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

// update trạng thái của lô kế hoạch thành hoàn thành
router.patch("/lokehoach/status3/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoachphanxuong SET 
                        status = 3
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

// update trạng thái của lô nhà máy thành đăng ký
router.patch("/lonhamay/status1/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoach SET 
                        status = 1
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

// update trạng thái của lô nhà máy thành sản xuất
router.patch("/lonhamay/status2/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoach SET 
                        status = 2
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

// update trạng thái của lô nhà máy thành hoàn thành
router.patch("/lonhamay/status3/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoach SET 
                        status = 3
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

// update trạng thái của lô nhà máy thành 0
router.patch("/lonhamay/status0/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lokehoach = result.recordset[0];
    if (lokehoach) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `UPDATE lokehoach SET 
                        status = 0
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

// update ghi chú lô sản xuất tại form dslosx
router.patch("/losanxuat/ghichu/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lsx = result.recordset[0];
    if (lsx) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("ghichu", req.body.ghichu)
        .query(
          `UPDATE losanxuat SET 
                        ghichu = @ghichu
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

router.post("/addkehoach", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.body.makh)
      .input("mota", req.body.mota)
      .input("soluong", req.body.soluong)
      .input("tgbatdau", req.body.tgbatdau)
      .input("tgketthuc", req.body.tgketthuc)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("status", req.body.status).query(`
                      INSERT INTO kehoach (makh, mota, soluong, tgbatdau, tgketthuc, ghichu, createdAt, createdBy, status) 
                      VALUES (@makh, @mota, @soluong, @tgbatdau, @tgketthuc, @ghichu, @createdAt, @createdBy, @status);
                  `);
    const kehoach = req.body;
    res.json(kehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data phong ban
router.get("/alllokehoach", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM kehoach order by makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data lokehoach where _id của kế hoạch năm
router.get("/getallkehoachpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khnam", req.query._id_khnam)
      .query(
        `SELECT * FROM lokehoach where _id_khnam=@_id_khnam order by ngaykt`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lo ke hoạch phân xưởng
router.get("/showlokehoachpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_lonhamay", req.query._id_lonhamay)
      .query(
        `SELECT * FROM lokehoachphanxuong where _id_lonhamay=@_id_lonhamay order by ttqt`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get tên vật tư
router.get("/gettenvt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("mavt", req.query.mavt)
      .query(`SELECT tenvt FROM dmnc where mapx=@mapx and mavt=@mavt`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô nhà máy theo nhóm sp
router.get("/searchnhomsp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nhomsp", req.query.nhomsp)
      .query(`SELECT * FROM lokehoach where nhomsp=@nhomsp order by makhpx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô nhà máy theo nhóm thành phẩm
router.get("/searchnhomthanhpham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nhomthanhpham", req.query.nhomthanhpham)
      .query(
        `SELECT l.*, 
        COALESCE(p.px1, 0) AS px1, 
        COALESCE(p.px2, 0) AS px2, 
        COALESCE(p.px3, 0) AS px3, 
        COALESCE(p.px4, 0) AS px4, 
        COALESCE(p.px5, 0) AS px5
     FROM lokehoach l
     LEFT JOIN (
       SELECT malonhamay, 
          SUM(CASE WHEN ttqt = 1 THEN soluongkhpx ELSE 0 END) AS px1, 
          SUM(CASE WHEN ttqt = 2 THEN soluongkhpx ELSE 0 END) AS px2, 
          SUM(CASE WHEN ttqt = 3 THEN soluongkhpx ELSE 0 END) AS px3, 
          SUM(CASE WHEN ttqt = 4 THEN soluongkhpx ELSE 0 END) AS px4, 
          SUM(CASE WHEN ttqt = 5 THEN soluongkhpx ELSE 0 END) AS px5
       FROM lokehoachphanxuong where nhomthanhpham=@nhomthanhpham
       GROUP BY malonhamay
     ) p ON l.malonhamay = p.malonhamay WHERE l.nhomthanhpham=@nhomthanhpham order by ngaykt`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô nhà máy theo mã thành phẩm
router.get("/searchmathanhpham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mathanhpham", req.query.mathanhpham)
      .query(
        `SELECT l.*, 
        COALESCE(p.px1, 0) AS px1, 
        COALESCE(p.px2, 0) AS px2, 
        COALESCE(p.px3, 0) AS px3, 
        COALESCE(p.px4, 0) AS px4, 
        COALESCE(p.px5, 0) AS px5
     FROM lokehoach l
     LEFT JOIN (
       SELECT malonhamay, 
          SUM(CASE WHEN ttqt = 1 THEN soluongkhpx ELSE 0 END) AS px1, 
          SUM(CASE WHEN ttqt = 2 THEN soluongkhpx ELSE 0 END) AS px2, 
          SUM(CASE WHEN ttqt = 3 THEN soluongkhpx ELSE 0 END) AS px3, 
          SUM(CASE WHEN ttqt = 4 THEN soluongkhpx ELSE 0 END) AS px4, 
          SUM(CASE WHEN ttqt = 5 THEN soluongkhpx ELSE 0 END) AS px5
       FROM lokehoachphanxuong where mathanhpham=@mathanhpham
       GROUP BY malonhamay
     ) p ON l.malonhamay = p.malonhamay WHERE l.mathanhpham=@mathanhpham order by ngaykt`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô kế hoạch phân xưởng theo nhóm sp
router.get("/searchnhomsplokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nhomsp", req.query.nhomsp)
      .query(
        `SELECT * FROM lokehoachphanxuong where nhomsp=@nhomsp order by makh`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô kế hoạch phân xưởng theo sp
router.get("/searchsplokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maspkhpx", req.query.maspkhpx)
      .query(
        `SELECT * FROM lokehoachphanxuong where maspkhpx=@maspkhpx order by makh`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô kế hoạch phân xưởng theo mã lô nhà máy
router.get("/searchmalonmlokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .query(`SELECT * FROM lokehoachphanxuong where makh=@makh order by makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô kế hoạch phân xưởng theo trước ngày kết thúc
router.get("/searchlokhpxtheongaykt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngayktkhpx", req.query.ngayktkhpx)
      .query(
        `select * from lokehoachphanxuong where ngayktkhpx <= @ngayktkhpx order by ngayktkhpx, makh`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô nhà máy theo sp
router.get("/searchsanpham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masp", req.query.masp)
      .query(`SELECT * FROM lokehoach where masp=@masp order by makhpx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô nhà máy theo sp và nhóm sp
router.get("/searchsanphamandnhomsp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masp", req.query.masp)
      .input("nhomsp", req.query.nhomsp)
      .query(
        `SELECT * FROM lokehoach where masp=@masp and nhomsp=@nhomsp order by makhpx`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô nhà máy theo ngày kết thúc
router.get("/searchtimekt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().input("ngaykt", req.query.ngaykt)
      .query(`SELECT l.*, 
      COALESCE(p.px1, 0) AS px1, 
      COALESCE(p.px2, 0) AS px2, 
      COALESCE(p.px3, 0) AS px3, 
      COALESCE(p.px4, 0) AS px4, 
      COALESCE(p.px5, 0) AS px5
   FROM lokehoach l
   LEFT JOIN (
     SELECT malonhamay, 
        SUM(CASE WHEN ttqt = 1 THEN soluongkhpx ELSE 0 END) AS px1, 
        SUM(CASE WHEN ttqt = 2 THEN soluongkhpx ELSE 0 END) AS px2, 
        SUM(CASE WHEN ttqt = 3 THEN soluongkhpx ELSE 0 END) AS px3, 
        SUM(CASE WHEN ttqt = 4 THEN soluongkhpx ELSE 0 END) AS px4, 
        SUM(CASE WHEN ttqt = 5 THEN soluongkhpx ELSE 0 END) AS px5
     FROM lokehoachphanxuong where ngayktlonm<=@ngaykt
     GROUP BY malonhamay
   ) p ON l.malonhamay = p.malonhamay WHERE l.ngaykt < = @ngaykt order by ngaykt`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm dữ liệu lô kế hoạch năm theo ngày kết thúc
router.get("/searchtimektkhn", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("tgketthuc", req.query.tgketthuc)
      .query(
        `SELECT * FROM kehoach where tgketthuc <= @tgketthuc order by makh`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all mã lô sản xuất
router.get("/getallmalsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`SELECT * FROM losanxuat where mapx=@mapx`);
    const lsx = result.recordset;

    res.json(lsx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one mã lô kế hoạch
router.get("/getonemakh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("makh", req.query.makh)
      .query(`SELECT * FROM lokehoach where mapx=@mapx and makh=@makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all Kế hoạch năm
router.get("/getkehoach", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM kehoach order by _id`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phan xưởng tham gia sản xuất
router.get("/allphanxuonginkh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .query(`SELECT * FROM lokehoach where makh=@makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all mã lô nhà máy
router.get("/alllonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM lokehoach order by makhpx, ngaykt`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all mã lô nhà máy kèm số lượng lô khpx đã đăng ký
router.get("/alllonhamaywithsoluonglokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .execute("fetch_lonhamay_pivot_soluong_khpx");
    const lokehoach = result.recordset;

    res.json({
      data: lokehoach,
      success: true,
      message: "load ok",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all mã lô kế hoạch phân xưởng
router.get("/alllokehoachphanxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM lokehoachphanxuong order by makhpx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// kiểm tra xem có công đoạn phát sinh tại 1 lô sản xuất nào đó chưa
router.get("/checkcongdoaninlsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("makhpx", req.query.makhpx)
      .input("mapx", req.query.mapx)
      .input("malosx", req.query.malosx)
      .query(
        `select * from luongcongnhan where makh=@makh and makhpx=@makhpx and mapx=@mapx and malosx=@malosx`
      );
    const lokehoach = result.recordset;
    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all các đơn vị có tham gia trong kế hoạch sản xuất
router.get("/allphanxuonginlkh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .query(`select mapx, tenpx from lokehoach where makh=@makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lấy xưởng trong khi tạo lô sản xuất tương ứng với xưởng đó
router.get("/phanxuonglsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("makhpx", req.query.makhpx)
      .input("mapx", req.query.mapx)
      .query(
        `select mapx, tenpx from lokehoach where makh=@makh and makhpx=@makhpx and mapx=@mapx`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get nhóm lương của phân xưởng đúc
router.get("/getnhomluongpxd", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from dmnc where mapx='PXD'`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get nhóm lương các phân xưởng còn lại
router.get("/getnhomluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`select * from dmnc where mapx=@mapx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get mã kế hoạch phân xưởng với mã kế hoạch và mã phân xưởng
router.get("/getmakhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("mapx", req.query.mapx)
      .query(`select makhpx from lokehoach where makh=@makh and mapx=@mapx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get mã sản phẩm trong kế hoạch
router.get("/getmaspinkh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .query(`select masp, tensp from kehoach where makh=@makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get mã nhóm lương dựa vào mã sp và mã phân xưởng
router.get("/getnhomluongtheompx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("mavt", req.query.mavt)
      .query(`select * from dmnc where mapx=@mapx and mavt=@mavt`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one mã lô kế hoạch
router.get("/searchmkh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .query(`select * from kehoach where makh=@makh`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get số mã lô kế hoạch
router.get("/getlokh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(makh) from lokehoach`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get mã kế hoạch trong bảng kế hoạch
router.get("/malokh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`select makh from kehoach`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get số mã lô kế hoạch in losanxuat
router.get("/getlokhinlsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(makh) from losanxuat`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get số mã lô sản xuất
router.get("/getlosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`select malosx from losanxuat`);
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get số mã lô sản xuất
router.get("/losanxuattaipx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("makhpx", req.query.makhpx)
      .input("mapx", req.query.mapx)
      .query(
        `select * from losanxuat where makh=@makh and makhpx=@makhpx and mapx=@mapx order by malosx`
      );
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get ma lo co trong bang luongcongnhan
router.get("/getlosxinluongcongnhan", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("makhpx", req.query.makhpx)
      .input("mapx", req.query.mapx)
      .query(`select * from losanxuat where makh=@makh and makhpx=@makhpx and mapx=@mapx
      and malosx in (select malosx from luongcongnhan where makh=@makh and makhpx=@makhpx and mapx=@mapx)`);
    const losx = result.recordset;

    res.json(losx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all tên phân xưởng from mã sản lô kế hoạch
router.get("/getallpxinmalkh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("nhomsp", req.query.nhomsp)
      .query(
        `select * from lokehoach where makh=@makh and nhomsp=@nhomsp order by mapx`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get mã kế hoạch theo mã
router.get("/getallkhmuavu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.query._id)
      .query(`select * from kehoach where _id=@_id`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lô kế hoạch phân xưởng sắp xếp theo mã phân xưởng
router.get("/getallkehoachphanxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request()
      .query(`SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lô kế hoạch phân xưởng sắp xếp theo mã phân xưởng
router.get("/getallkehoachphanxuong_chonlkhdesx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .execute("fetch_lokhpx_pivot_soluong_losx_all_status");
    const lokh = result.recordset;

    res.json({
      success: true,
      data: lokh,
      message: "load ok",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lô kế hoạch phân xưởng sắp xếp theo mã phân xưởng chỉ status=2
router.get("/getallkehoachphanxuongwithout0", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .execute("fetch_lokhpx_pivot_soluong_losx");
    const lokh = result.recordset;

    res.json({
      success: true,
      data: lokh,
      message: "",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lô kế hoạch phân xưởng where mã phân xưởng and trong tháng cần chọn và xếp theo ngày kết thúc
router.get("/getallkehoachpxwithpxorderbyngaykt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("ngaybdkhpx", req.query.ngaybdkhpx)
      .input("ngayktkhpx", req.query.ngayktkhpx)
      .query(
        `select * from lokehoachphanxuong where mapx=@mapx and ngayktkhpx between @ngaybdkhpx and @ngayktkhpx order by ngayktkhpx, makhpx`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lô kế hoạch phân xưởng where mã phân xưởng
router.get("/getallkehoachpxwithmapx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(
        `select * from lokehoachphanxuong where mapx=@mapx order by makh, ngayktkhpx`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// sắp xếp các lô nhà máy và sort theo thứ tự quy trình
router.get("/sortmalonmsortttqt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from lokehoachphanxuong order by makh, ttqt`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// show all mã sản phẩm với điều kiện status = 2 and status = 1
router.get("/pivotproduct", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request()
      .query(`SELECT ROW_NUMBER() OVER(ORDER BY maspkhpx) AS id, maspkhpx, mapx, nhomsp
	FROM lokehoachphanxuong
	where status = 2 or status = 1
	GROUP BY maspkhpx, mapx, nhomsp`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc theo mã px mã sản phẩm với điều kiện status = 2 and status = 1
router.get("/pivotproductmapx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().input("mapx", req.query.mapx)
      .query(`SELECT ROW_NUMBER() OVER(ORDER BY maspkhpx) AS id, maspkhpx, mapx, nhomsp
	FROM lokehoachphanxuong
	where (status = 2 or status = 1) and mapx=@mapx
	GROUP BY maspkhpx, mapx, nhomsp`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// show ra nhóm mã kế hoạch phân xưởng dựa vào mã sp phía trên
router.get("/pivotmakhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maspkhpx", req.query.maspkhpx)
      .input("mapx", req.query.mapx)
      .query(`SELECT ROW_NUMBER() OVER(ORDER BY makhpx) AS id, makhpx, soluongkhpx, mapx
	FROM lokehoachphanxuong
	where (status = 2 or status = 1) and maspkhpx=@maspkhpx and mapx=@mapx
	GROUP BY makhpx, soluongkhpx, mapx`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// show all lô sản xuất dựa theo mấy tiêu chí như mapx, makhpx, masp và mã lô nhà máy (nếu dc)
router.get("/pivotlosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masp", req.query.masp)
      .input("mapx", req.query.mapx)
      .input("makhpx", req.query.makhpx)
      .query(
        `select * from losanxuat where masp=@masp and mapx=mapx and makhpx=@makhpx`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// search malo sx
router.get("/searchlsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("malosx", req.query.malosx)
      .query(`select * from losanxuat where malosx=@malosx`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu dangkylosanxuat theo cac dieu kiện status
router.get("/searchstatus", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("status", req.query.status)
      .query(`select * from lokehoachphanxuong where status=@status`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu dangkylosanxuat theo cac dieu kiện status=1 hoac 2
router.get("/searchstatus12", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from lokehoachphanxuong where status=1 or status=2`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí full tiêu chí đang thiếu nhóm sp
router.get("/filterfulldk", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const nhomsp = req.query.nhomsp;
    // console.log(nhomsp);
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from lokehoachphanxuong where mapx in (${strpx}) and maspkhpx='${masp}' and status in (${strstatus}) and nhomsp='${nhomsp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí full tiêu chí --- mã thành phẩm (# mã sản phẩm)
router.get("/filterfulldkmtp", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const matp = req.query.matp;
    // console.log(matp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const nhomtp = req.query.nhomtp;
    // console.log(nhomtp);
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mapx in (${strpx}) and t.mathanhpham='${matp}' and t.status in (${strstatus}) and t.nhomthanhpham='${nhomtp}'`
    );
    const tenpx = result.recordset;
    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px
router.get("/filteronlymapx", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    await pool.connect();
    const result = await pool.request().query(`with t as(
      SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
      coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
          FROM lokehoachphanxuong AS khpx 
          LEFT JOIN (
            SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
            sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
            FROM losanxuat
            GROUP BY _id_khpx
          ) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mapx in (${strpx})`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và mã sp
router.get("/filteronlymapxandmasp", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from lokehoachphanxuong where mapx in (${strpx}) and maspkhpx='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và mã thành phẩm
router.get("/filteronlymapxandmatp", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const matp = req.query.matp;
    // console.log(matp);
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mapx in (${strpx}) and t.mathanhpham='${matp}'`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// new update
// lọc dữ liệu theo tiêu chí chỉ có mã px và nhomsp - new update
router.get("/filteronlymapxandnhomtp", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const nhomtp = req.query.nhomtp;
    // console.log(req.query.nhomtp);
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mapx in (${strpx}) and t.nhomthanhpham='${nhomtp}'`
    );
    const tenpx = result.recordset;
    console.log(tenpx);
    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có nhomsp - new update
router.get("/filteronlynhomtp", async (req, res) => {
  try {
    const nhomtp = req.query.nhomtp;
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.nhomthanhpham='${nhomtp}'`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có nhomsp và sản phẩm - new update
router.get("/filteronlynhomspandmasp", async (req, res) => {
  try {
    const nhomsp = req.query.nhomsp;
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from lokehoachphanxuong where nhomsp='${nhomsp}' and maspkhpx='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có nhomsp và sản phẩm - new update
router.get("/filteronlynhomtpandmatp", async (req, res) => {
  try {
    const nhomtp = req.query.nhomtp;
    const matp = req.query.matp;
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.nhomthanhpham='${nhomtp}' and t.mathanhpham='${matp}'`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí nhóm sản phẩm; nhóm thành phẩm; trạng thái
router.get("/filteronlynhomtpnhomtpstatus", async (req, res) => {
  try {
    const nhomtp = req.query.nhomtp;
    const matp = req.query.matp;
    const statusList = req.query.status;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.nhomthanhpham='${nhomtp}' and t.mathanhpham='${matp}'and t.status in (${strstatus})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có nhomsp và trạng thái - new update
router.get("/filteronlynhomtpandstatus", async (req, res) => {
  try {
    const nhomtp = req.query.nhomtp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.nhomthanhpham='${nhomtp}' and t.status in (${strstatus})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có nhomsp và trạng thái - new update
router.get("/filteronlypxandnhomtpandstatus", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const nhomtp = req.query.nhomtp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.nhomthanhpham='${nhomtp}' and t.status in (${strstatus}) and t.mapx in (${strpx})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/filtermapxmatpstatus", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const matp = req.query.matp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mathanhpham='${matp}' and t.status in (${strstatus}) and t.mapx in (${strpx})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí xưởng - nhóm tp - mã thành phẩm
router.get("/filteronlypxandnhomtpmatp", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const nhomtp = req.query.nhomtp;
    // console.log(nhomtp);
    const matp = req.query.matp;
    // console.log(matp);
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.nhomthanhpham='${nhomtp}' and t.mathanhpham in ('${matp}') and t.mapx in (${strpx})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí xưởng - mã thành phẩm - trạng thái
router.get("/filteronlypxandmatptrangthai", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(nhomtp);
    const matp = req.query.matp;
    // console.log(matp);
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.status in (${strstatus}) and t.mathanhpham in ('${matp}') and t.mapx in (${strpx})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có nhomsp và trạng thái và mã px - new update
router.get("/filteronlypxandmaspandstatus", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const masp = req.query.masp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from lokehoachphanxuong where maspkhpx='${masp}' and status in (${strstatus}) and mapx in (${strpx})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và trạng thái
router.get("/filteronlymapxandstatus", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const statusList = req.query.status;
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mapx in (${strpx}) and t.status in (${strstatus})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có trạng thái
router.get("/filteronlystatus", async (req, res) => {
  try {
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(`with t as(
      SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.status in (${strstatus})`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã sp
router.get("/filteronlymasp", async (req, res) => {
  try {
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from lokehoachphanxuong where maspkhpx='${masp}'`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã thành phẩm
router.get("/filteronlymatp", async (req, res) => {
  try {
    const matp = req.query.matp;
    await pool.connect();
    const result = await pool.request().query(`with t as(
      SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx
      ) select * from t where t.mathanhpham='${matp}'`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã sp và trạng thái
router.get("/filteronlymaspandstatus", async (req, res) => {
  try {
    const masp = req.query.masp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from lokehoachphanxuong where maspkhpx='${masp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã thành phẩm và trạng thái
router.get("/filteronlymatpandstatus", async (req, res) => {
  try {
    const matp = req.query.matp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool.request().query(
      `with t as(
        SELECT khpx.*, COALESCE(tongsoluong, 0) AS tong_soluong, coalesce(tongsoluongnhanh,0) as tongso_luongnhanh,
coalesce(tongsodat,0) as tongso_dat, coalesce(tongsohong,0) as tongso_hong
		FROM lokehoachphanxuong AS khpx 
		LEFT JOIN (
		  SELECT _id_khpx, SUM(cast(soluonglsx as int)) AS tongsoluong, SUM(cast(soluongkhsx as int)) AS tongsoluongnhanh,
		  sum(cast(tongdat as int)) as tongsodat, sum(cast(tonghong as int)) as tongsohong
		  FROM losanxuat
		  GROUP BY _id_khpx
		) AS losx ON khpx._id = losx._id_khpx

      ) select * from t where t.mathanhpham='${matp}' and t.status in (${strstatus})`
    );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// thêm tổ
// lọc dữ liệu theo tiêu chí full tiêu chí lô sản xuất
router.get("/filterfulldklosanxuatthemto", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto}) and masp='${masp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/filtermatomaxuongstatuslosanxuatthemto", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    const strstatus = "'" + statusList.join("','") + "'";

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto}) and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chỉ có ma to ma xxuong nhomsp
router.get("/filtermatomaxuongnhomspdklosanxuatthemto", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    // const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    // console.log(strpx);
    // const masp = req.query.masp;
    // // console.log(masp);
    // const strstatus = "'" + statusList.join("','") + "'";
    // // console.log(strstatus);
    const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto}) and nhomsp='${nhomsp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chỉ có ma to ma xxuong masp
router.get("/filtermatomaxuongmaspdklosanxuatthemto", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    // const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // // console.log(masp);
    // const strstatus = "'" + statusList.join("','") + "'";
    // // console.log(strstatus);
    // const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto}) and masp='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/filterxuongtomaspstatus", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // // console.log(strstatus);
    // const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto}) and masp='${masp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/filterxuongtonhomspstatus", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    // console.log(strpx);
    // const masp = req.query.masp;
    // // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // // console.log(strstatus);
    const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto}) and nhomsp='${nhomsp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chỉ có ma to ma xxuong
router.get("/filtermatomaxuongdklosanxuatthemto", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const matoList = req.query.mato;
    // const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const strto = "'" + matoList.join("','") + "'";
    // console.log(strpx);
    // const masp = req.query.masp;
    // // console.log(masp);
    // const strstatus = "'" + statusList.join("','") + "'";
    // // console.log(strstatus);
    // const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in (${strto})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí full tiêu chí lô sản xuất
router.get("/filterfulldklosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const nhomsp = req.query.nhomsp;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and masp='${masp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí full tiêu chí lô sản xuất
router.get("/filterlosxmapxstatusngaybd", async (req, res) => {
  try {
    console.log(req.query.ngaybd);
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    const strpx = "'" + mapxList.join("','") + "'";
    const strstatus = "'" + statusList.join("','") + "'";
    const ngaybd = req.query.ngaybd;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and status in (${strstatus}) and ngaybd='${ngaybd}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/filterlosxmapxstatusngaybdwithto", async (req, res) => {
  try {
    // console.log(req.query.ngaybd);
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    const strpx = "'" + mapxList.join("','") + "'";
    const strstatus = "'" + statusList.join("','") + "'";
    const ngaybd = req.query.ngaybd;
    const matoList = req.query.mato;
    const strto = "'" + matoList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in(${strto}) and status in (${strstatus}) and ngaybd='${ngaybd}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/filterxuongtomaspstatusngaybd", async (req, res) => {
  try {
    // console.log(req.query.ngaybd);
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    const strpx = "'" + mapxList.join("','") + "'";
    const strstatus = "'" + statusList.join("','") + "'";
    const ngaybd = req.query.ngaybd;
    const matoList = req.query.mato;
    const strto = "'" + matoList.join("','") + "'";
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and mato in(${strto}) and masp='${masp}' and status in (${strstatus}) and ngaybd='${ngaybd}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px
router.get("/filteronlymapxlosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from losanxuat where mapx in (${strpx})`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và mã sp
router.get("/filteronlymapxandmasplosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and masp='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và nhóm sp
router.get("/filteronlymapxandnhomsplosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const nhomsp = req.query.nhomsp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and nhomsp='${nhomsp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và trạng thái
router.get("/filteronlymapxandstatuslosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const statusList = req.query.status;
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và trạng thái và nhóm sp
router.get("/filteronlymapxandstatusnhomsplosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(mapxList);
    const statusList = req.query.status;
    // console.log(strpx);
    const strstatus = "'" + statusList.join("','") + "'";
    const nhomsp = req.query.nhomsp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and status in (${strstatus}) and nhomsp='${nhomsp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã px và trạng thái và mã sp
router.get("/filteronlymapxandstatusmasplosanxuat", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(mapxList);
    const statusList = req.query.status;
    // console.log(strpx);
    const strstatus = "'" + statusList.join("','") + "'";
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and status in (${strstatus}) and masp='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có trạng thái
router.get("/filteronlystatuslosanxuat", async (req, res) => {
  try {
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from losanxuat where status in (${strstatus})`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã sp
router.get("/filteronlymasplosanxuat", async (req, res) => {
  try {
    const masp = req.query.masp;
    console.log(masp);
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from losanxuat where masp='${masp}'`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã sp và trạng thái
router.get("/filteronlymaspandstatuslosx", async (req, res) => {
  try {
    const masp = req.query.masp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where masp='${masp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã sp và trạng thái
router.get("/filteronlynhomspandstatuslosx", async (req, res) => {
  try {
    const nhomsp = req.query.nhomsp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where nhomsp='${nhomsp}' and status in (${strstatus})`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí chỉ có mã sp và trạng thái
router.get("/filteronlynhomspandstatuslosxmasp", async (req, res) => {
  try {
    const nhomsp = req.query.nhomsp;
    const masp = req.query.masp;
    const statusList = req.query.status;
    const strstatus = "'" + statusList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where nhomsp='${nhomsp}' and status in (${strstatus}) and masp='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí full tiêu chí lô sản xuất có cả ngày hoàn thành
router.get("/filterfulldklosanxuatwithngayhttt", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and masp='${masp}' and status in (${strstatus}) and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// phan xuong ma san pham ngay hoan thanh
router.get("/mapxmaspngayhoanthanhlsx", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    // const strstatus = "'" + statusList.join("','") + "'";
    // // console.log(strstatus);
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and masp='${masp}' and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// phan xuong trạng thái ngay hoan thanh
router.get("/mapxstatusngayhoanthanhlsx", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    // const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and status in (${strstatus}) and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ma spham trạng thái ngay hoan thanh
router.get("/maspstatusngayhoanthanhlsx", async (req, res) => {
  try {
    // const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    // const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where masp = ('${masp}') and status in (${strstatus}) and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ma spham ngay hoan thanh
router.get("/maspngayhoanthanhlsx", async (req, res) => {
  try {
    // const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    // const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where masp = ('${masp}') and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// status ngay hoan thanh
router.get("/statusngayhoanthanhlsx", async (req, res) => {
  try {
    // const mapxList = req.query.mapx;
    const statusList = req.query.status;
    // console.log(mapxList);
    // const strpx = "'" + mapxList.join("','") + "'";
    // console.log(strpx);
    // const masp = req.query.masp;
    // console.log(masp);
    const strstatus = "'" + statusList.join("','") + "'";
    // console.log(strstatus);
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where status in (${strstatus}) and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu phân xưởng ngày hoàn thành
router.get("/filterphanxuongandngayhttt", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    // console.log(mapxList);
    const strpx = "'" + mapxList.join("','") + "'";
    const ngayhoanthanh = req.query.ngayhoanthanh;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where mapx in (${strpx}) and ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ngày hoàn thành
router.get("/onlyngayhoanthanh", async (req, res) => {
  try {
    const ngayhoanthanh = req.query.ngayhoanthanh;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where ngayhoanthanhtt='${ngayhoanthanh}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu lô sản xuất theo phân xưởng và ngày hoàn thành trong giai đoạn
router.get("/locphanxuonggiaidoanhoanthanh", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const strpx = "'" + mapxList.join("','") + "'";
    const batdau = req.query.dateFrom;
    const ketthuc = req.query.dateTo;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where status=3 and mapx in (${strpx}) and ngayhoanthanhtt between '${batdau}' and '${ketthuc}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu lô sản xuất theo phân xưởng và ngày hoàn thành trong giai đoạn chưa chốt
router.get("/locphanxuonggiaidoanhoanthanhlochuachot", async (req, res) => {
  try {
    const mapxList = req.query.mapx;
    const strpx = "'" + mapxList.join("','") + "'";
    const batdau = req.query.dateFrom;
    const ketthuc = req.query.dateTo;
    const status_tinhluong = req.query.status_tinhluong;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where status=3 and mapx in (${strpx}) and ngayhoanthanhtt between '${batdau}' and '${ketthuc}' and status_tinhluong=${status_tinhluong}`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu lô sản xuất ngày hoàn thành trong giai đoạn
router.get("/locgiaidoanhoanthanh", async (req, res) => {
  try {
    const batdau = req.query.dateFrom;
    const ketthuc = req.query.dateTo;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where status=3 and ngayhoanthanhtt between '${batdau}' and '${ketthuc}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu lô sản xuất ngày hoàn thành trong giai đoạn lô chưa chốt
router.get("/locgiaidoanhoanthanhlochuachot", async (req, res) => {
  try {
    const batdau = req.query.dateFrom;
    const ketthuc = req.query.dateTo;
    const status_tinhluong = req.query.status_tinhluong;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where status=3 and ngayhoanthanhtt between '${batdau}' and '${ketthuc}' and status_tinhluong=${status_tinhluong}`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu lô sản xuất đã chốt
router.get("/loconlydachotlsx", async (req, res) => {
  try {
    const status_tinhluong = req.query.status_tinhluong;

    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where status=3 and status_tinhluong=${status_tinhluong}`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí mapx; nhóm sp; mã sp
router.get("/filtermapxnhomspmasp", async (req, res) => {
  try {
    const nhomsp = req.query.nhomsp;
    const masp = req.query.masp;
    const mapxList = req.query.mapx;
    const strpx = "'" + mapxList.join("','") + "'";
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where nhomsp='${nhomsp}' and mapx in (${strpx}) and masp='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí nhóm sp
router.get("/filteronlynhomsp", async (req, res) => {
  try {
    const nhomsp = req.query.nhomsp;
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from losanxuat where nhomsp='${nhomsp}'`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu theo tiêu chí nhóm sp; mã sp
router.get("/filternhomspmasp", async (req, res) => {
  try {
    const nhomsp = req.query.nhomsp;
    const masp = req.query.masp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from losanxuat where nhomsp='${nhomsp}' and masp='${masp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu mã thành phẩm + tên thành phẩm
router.get("/locmathanhphamnhomthanhpham", async (req, res) => {
  try {
    const matp = req.query.matp;
    const nhomtp = req.query.nhomtp;
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select * from lokehoach where mathanhpham='${matp}' and nhomthanhpham='${nhomtp}'`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu mã thành phẩm
router.get("/locmathanhpham", async (req, res) => {
  try {
    const matp = req.query.matp;
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from lokehoach where mathanhpham='${matp}'`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lọc dữ liệu mã thành phẩm + tên thành phẩm
router.get("/locnhomthanhpham", async (req, res) => {
  try {
    const nhomtp = req.query.nhomtp;
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from lokehoach where nhomthanhpham='${nhomtp}'`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu sản phẩm trong lô sản xuất
router.get("/hmsanphamlosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(masp) from losanxuat`);
    const tenpx = result.recordset;
    // console.log(tenpx)
    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu sản phẩm trong lô kế hoạch phân xưởng
router.get("/hmsanphamlokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(maspkhpx) as masp from lokehoachphanxuong`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu mã thành phẩm trong lô kế hoạch phân xưởng
router.get("/matpinlokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select distinct(mathanhpham) as mathanhpham from lokehoachphanxuong`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// nhóm thành phẩm trong lô nhà máy
router.get("/nhomtpinlonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(nhomthanhpham) from lokehoach`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get danh mục thành phẩm
router.get("/getallthanhpham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`select * from dm_banthanhpham`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get danh mục thành phẩm
router.get("/getallthanhphamwithmtp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mathanhpham", req.query.mathanhpham)
      .query(`select * from dm_banthanhpham where mathanhpham=@mathanhpham`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// mã thành phẩm trong lô nhà máy
router.get("/matpinlonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(mathanhpham) from lokehoach`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu nhóm thành phẩm trong lô kế hoạch phân xưởng
router.get("/nhomthanhphamlokhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `select distinct(nhomthanhpham) as nhomthanhpham from lokehoachphanxuong`
      );
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu nhóm thành phẩm trong lô kế hoạch phân xưởng
router.get("/nhomthanhphamlonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(nhomthanhpham) as nhomthanhpham from lokehoach`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu mã thành phẩm trong lô kế hoạch phân xưởng
router.get("/mathanhphamlonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(mathanhpham) as mathanhpham from lokehoach`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu sản phẩm trong lô sản xuất
router.get("/hmsanphamlosanxuat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(masp) as masp from losanxuat`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu sản phẩm trong lô sản xuất
router.get("/nhomspinlosanxuat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(nhomsp) as nhomsp from losanxuat`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tìm xem có bao nhiêu sản phẩm trong dmnc
router.get("/nhomspindmnc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(nhomsp) as nhomsp from dmnc`);
    const nhomsp = result.recordset;
    res.json(nhomsp);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/maspindmnc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(mavt) as mavt from dmnc`);
    const nhomsp = result.recordset;
    res.json(nhomsp);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/searchMaspinnc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mavt", req.query.mavt)
      .query(`select * from dmnc where mavt=@mavt`);
    const nhomsp = result.recordset;
    res.json(nhomsp);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/searchnhomspinnc", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nhomsp", req.query.nhomsp)
      .query(`select * from dmnc where nhomsp=@nhomsp`);
    const nhomsp = result.recordset;
    res.json(nhomsp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lô sản xuất trong 1 kế hoạch phân xưởng
router.get("/getalllsxinkhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khpx", req.query._id_khpx)
      .query(`select * from losanxuat where _id_khpx=@_id_khpx order by _id`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm lô sản xuất theo trạng thái
router.get("/alllsxwstatus", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("status", req.query.status)
      .query(`select * from losanxuat where status=@status`);
    const tenpx = result.recordset;

    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all các lô sản xuất trong 1 phân xưởng nào đó dựa vào mã lô kế hoạch và mã px
router.get("/getalllsxinlkh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("makhpx", req.query.makhpx)
      .input("mapx", req.query.mapx).query(`select * from losanxuat 
      where makh=@makh and makhpx=@makhpx and mapx=@mapx order by ngaybd`);
    const tenpx = result.recordset;
    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// test
router.get("/gettest", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`select * from test 
      `);
    const tenpx = result.recordset;
    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm mã kế hoạch năm xem có tồn tại trong mã lô nhà máy không?
// nếu có thì k cho xóa
router.get("/predelete_muctieunam", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      // .input("makh", req.query.makh)
      .input("_id", req.query._id)
      .query(
        `select _id from kehoach where _id in (select _id_khnam from lokehoach) AND _id = @_id`
      );

    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});
// tìm mã lô nhà máy xem  có tồn tại trong mã lô kế hoạch phân xưởng k (bảng lokehoachphanxuong)?
// nếu có thì k cho xóa
router.get("/predelete_lonhamay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      // .input("kehoachnam", req.query.kehoachnam)
      // .input("makh", req.query.makh)
      .input("_id", req.query._id)
      .query(
        // `select * from lokehoachphanxuong where kehoachnam=@kehoachnam and makh=@makh`
        `select _id from lokehoach where _id in (select _id_lonhamay from lokehoachphanxuong) AND _id = @_id`
      );
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});
// tìm mã lô kế hoạch phân xưởng xem  có tồn tại trong mã lô sản xuất không (bảng losanxuat)?
// nếu có thì k cho xóa
router.get("/predelete_lokehoachpx", async (req, res) => {
  try {
    await pool.connect();
    // const id = req.query._id;
    const result = await pool.request().input("_id", req.query._id).query(
      // `select * from losanxuat where kehoachnam=@kehoachnam and makh=@makh and makhpx=@makhpx and mapx=@mapx`
      `select _id from lokehoachphanxuong where _id in (select _id_khpx from losanxuat) AND _id = @_id`
    );
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all các lô sản xuất
router.get("/showalllosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from losanxuat order by ngaykt`);
    const tenpx = result.recordset;
    res.json(tenpx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get kế hoạch
router.get("/getkehoachone", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .query(`select * from kehoach where makh=@makh`);
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// TÌM KẾ HOẠCH NHÀ MÁY THEO ĐIỀU KIỆN
router.get("/getlokhnm", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nhomthanhpham", req.query.nhomthanhpham)
      .query(
        `select * from kehoach where nhomthanhpham=@nhomthanhpham order by makh`
      );
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// TÌM KẾ HOẠCH NHÀ MÁY THEO ĐIỀU KIỆN mã sản phẩm
router.get("/getlokhnmwithmasp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mathanhpham", req.query.mathanhpham)
      .query(
        `select * from kehoach where mathanhpham=@mathanhpham order by makh`
      );
    const losx = result.recordset;

    res.json(losx);
    //console.log(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm phiếu lô theo id
router.get("/searchwithid", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.query._id)
      .query(`select * from losanxuat where _id=@_id`);
    const lsx = result.recordset;

    res.json(lsx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm cả lô kế hoạch theo id
router.get("/lokehoachsearchwithid", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khpx", req.query._id_khpx)
      .query(`select * from losanxuat where _id_khpx=@_id_khpx`);
    const lsx = result.recordset;

    res.json(lsx);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm phiếu lô theo ngày hoàn thành tt
router.get("/searchwithngayhttt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngayhoanthanhtt", req.query.ngayhoanthanhtt)
      .query(`select * from losanxuat where ngayhoanthanhtt=@ngayhoanthanhtt`);
    const lsx = result.recordset;

    res.json(lsx);
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
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    const lokehoach = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (lokehoach) {
      res.json(lokehoach);
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

// delete kế hoạch nhà máy
router.delete("/dellkhnhamay/:makh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.params.makh)
      .query(`SELECT * FROM kehoach WHERE makh = @makh`);
    let lokehoach = result.recordset.length ? result.recordset[0] : null;
    if (lokehoach) {
      await pool
        .request()
        .input("makh", req.params.makh)
        .query(
          `DELETE FROM kehoach WHERE makh = @makh and makh not in (select makh from lokehoach)`
        );
      res.json(lokehoach);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Import table  */
router.post("/importkehoachnam", upload.single("file"), async (req, res) => {
  if (req.file) {
    //console.log(req.file);
    //console.log(req.file.path)
    let path = req.file.path;

    let rows = await readXlsxFile(path);
    rows.shift();
    //console.table(rows);
    // console.log(rows);

    const createdBy = req.body.createdBy;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    const table = new Table("kehoach");
    table.create = false;

    table.columns.add("makh", NVarChar, { nullable: true });
    table.columns.add("mathanhpham", NVarChar, {
      nullable: true,
    });
    table.columns.add("tenthanhpham", NVarChar, {
      nullable: true,
    });
    table.columns.add("nhomthanhpham", NVarChar, { nullable: true });
    table.columns.add("soluong", NVarChar, {
      nullable: true,
    });
    table.columns.add("soluongmuavup1", NVarChar, {
      nullable: true,
    });
    table.columns.add("soluongmuavup2", NVarChar, {
      nullable: true,
    });
    table.columns.add("soluongmuavup3", NVarChar, {
      nullable: true,
    });
    table.columns.add("tgbatdau", Date, {
      nullable: true,
    });
    table.columns.add("tgketthuc", Date, {
      nullable: true,
    });
    table.columns.add("makhachhang", NVarChar, {
      nullable: true,
    });
    table.columns.add("khachhang", NVarChar, { length: "max", nullable: true });
    table.columns.add("ghichu", NVarChar, {
      length: "max",
      nullable: true,
    });
    table.columns.add("status", Int, {
      nullable: true,
    });
    table.columns.add("createdAt", Date, {
      nullable: true,
    });
    table.columns.add("createdBy", NVarChar, {
      nullable: true,
    });
    table.columns.add("updatedAt", Date, {
      nullable: true,
    });
    table.columns.add("slthang1", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang2", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang3", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang4", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang5", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang6", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang7", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang8", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang9", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang10", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang11", NVarChar, {
      nullable: true,
    });
    table.columns.add("slthang12", NVarChar, {
      nullable: true,
    });

    // rows.forEach((row) => table.rows.add.apply(table.rows, row));

    // console.log(rows);

    for (let j = 0; j < rows.length; j += 1) {
      table.rows.add(
        rows[j][0],
        rows[j][1],
        rows[j][2],
        rows[j][3],
        rows[j][4],
        rows[j][5],
        rows[j][6],
        rows[j][7],
        rows[j][8],
        rows[j][9],
        rows[j][10],
        rows[j][11],
        rows[j][12],
        rows[j][13],
        createdAt,
        createdBy,
        updatedAt,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      );
    }

    try {
      await pool.connect();
      const results = await pool.request().bulk(table);
      console.log(`rows affected ${results.rowsAffected}`);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error,
      });
    }

    res.status(200).json({
      status: "succes",
    });
  } else {
    console.log("File not found !");
  }
});

// delete lô kế hoạch theo mã kế hoạch
router.delete("/dellokh/:makh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.params.makh)
      .query(`SELECT * FROM lokehoach WHERE makh = @makh`);
    let lokehoach = result.recordset.length ? result.recordset[0] : null;
    if (lokehoach) {
      await pool
        .request()
        .input("makh", req.params.makh)
        .query(
          `DELETE FROM lokehoach WHERE makh = @makh and makh not in (select makh from losanxuat)`
        );
      res.json(lokehoach);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete lô sản xuất
router.delete("/losanxuat/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let losx = result.recordset.length ? result.recordset[0] : null;
    if (losx) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM losanxuat WHERE _id = @_id;`);
      res.json(losx);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete luong cong đoạn
router.delete("/luongcongnhan/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM luongcongnhan WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `DELETE FROM luongcongnhan WHERE _id = @_id and status=0 and stopday_losx='';`
        );
      res.json(lcn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete 1 lô sản xuất điều kiện lô chưa được chốt
// chỉ được xóa lô ở trạng thái đăng ký status=1. stopday_losx không được tồn tại ngày
// datinhluong phải = 0, 1 là đã được tính không được xóa
// status_datinhluong = 0, 1 là không được xóa
router.delete("/losx/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `DELETE FROM losanxuat WHERE _id = @_id and status=0 and datinhluong=0 and status_tinhluong=0;`
        );
      res.json(lcn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete 1 kế hoạch nhà máy năm
// yêu cầu phải chưa phát sinh lô nhà máy
router.delete("/kehoachnam/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM kehoach WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `DELETE FROM kehoach WHERE _id = @_id and status=0 and _id not in (select _id_khnam from lokehoach)`
        );
      res.json(lcn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete 1 kế hoạch nhà máy
// yêu cầu phải chưa phát sinh lô kế hoạch phân xưởng
router.delete("/kehoachnhamay/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `DELETE FROM lokehoach WHERE _id = @_id and status=0 and _id not in (select _id_lonhamay from lokehoachphanxuong)`
        );
      res.json(lcn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// delete 1 kế hoạch phân xưởng
// yêu cầu phải chưa phát sinh lô sản xuất
router.delete("/kehoachphanxuong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(
          `DELETE FROM lokehoachphanxuong WHERE _id = @_id and status=0 and _id not in(select _id_khpx from losanxuat)`
        );
      res.json(lcn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete 1 lô kế hoạch nhà máy trong file quản lý lô sx
router.delete("/kehoachnhamaylsx/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoach WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM lokehoach WHERE _id = @_id and status=0`);
      res.json(lcn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete 1 lô kế hoạch phân xưởng
router.delete("/delkehoachphanxuong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM lokehoachphanxuong WHERE _id = @_id`);
    let lcn = result.recordset.length ? result.recordset[0] : null;
    if (lcn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM lokehoachphanxuong WHERE _id = @_id and status=0`);
      res.json(lcn);
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
