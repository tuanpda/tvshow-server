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
    // cb(null, "E:\\PROJECT\\TINHLUONGCONGDOAN\\client\\static\\avatar");
    cb(null, "E:\\CODE_APP\\TEAMGIT\\server\\filesupload"); // server
  },
  filename: function (req, file, cb) {
    cb(null, "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

// cập nhật cấp bậc lương
router.patch("/updatecapbacluong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM capbacluong WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
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
        .query(
          `UPDATE capbacluong SET 
                    nhom = @nhom, 
                    maso = @maso,
                    diengiai = @diengiai,
                    lcbmax = @lcbmax,
                    lcbmin = @lcbmin,
                    phucapmax = @phucapmax,
                    phucapmin = @phucapmin,
                    ghichu1 = @ghichu1,
                    ghichu2 = @ghichu2,
                    ghichu3 = @ghichu3
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

// cập nhật phiếu ứng tiền
router.patch("/phieuungtien/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM ungtien WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("nguoiung", req.body.nguoiung)
        .input("tienung", req.body.tienung)
        .input("ngayung", req.body.ngayung)
        .input("noidung", req.body.noidung)
        .input("phongban", req.body.phongban)
        .input("manv", req.body.manv)
        .query(
          `UPDATE ungtien SET 
                    nguoiung = @nguoiung, 
                    tienung = @tienung,
                    ngayung = @ngayung,
                    noidung = @noidung,
                    phongban = @phongban,
                    manv = @manv
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

// cập nhật quy tắc lương
router.patch("/quytactinhluong/:_id", async (req, res) => {
  try {
    // console.log(p.replace('dog', 'monkey'));
    kpcd = req.body.tl_dong_cd_cn;
    u_kpcd = kpcd.replace(",", "");
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM quytacluong WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("luong_ttv", req.body.luong_ttv)
        .input("luong_max_bhxh_bhyt", req.body.luong_max_bhxh_bhyt)
        .input("luong_max_bhtn", req.body.luong_max_bhtn)
        .input("songay_tinhluong", req.body.songay_tinhluong)
        .input("sogio_tinhluong", req.body.sogio_tinhluong)
        .input("tl_lamthem_thuong_bn", req.body.tl_lamthem_thuong_bn)
        .input("tl_lamthem_nghi_bn", req.body.tl_lamthem_nghi_bn)
        .input("tl_lamthem_le_bn", req.body.tl_lamthem_le_bn)
        .input("tl_lamthem_thuong_bd", req.body.tl_lamthem_thuong_bd)
        .input("tl_lamthem_nghi_bd", req.body.tl_lamthem_nghi_bd)
        .input("tl_lamthem_le_bd", req.body.tl_lamthem_le_bd)
        .input("tl_dong_bhxh_ct", req.body.tl_dong_bhxh_ct)
        .input("tl_dong_bhyt_ct", req.body.tl_dong_bhyt_ct)
        .input("tl_dong_bhtn_ct", req.body.tl_dong_bhtn_ct)
        .input("tl_dong_cd_ct", req.body.tl_dong_cd_ct)
        .input("tl_dong_bhxh_cn", req.body.tl_dong_bhxh_cn)
        .input("tl_dong_bhyt_cn", req.body.tl_dong_bhyt_cn)
        .input("tl_dong_bhtn_cn", req.body.tl_dong_bhtn_cn)
        .input("tl_dong_cd_cn", u_kpcd)
        .input("thue_tncn_gtcn", req.body.thue_tncn_gtcn)
        .input("thue_tncn_gtnt", req.body.thue_tncn_gtnt)
        .query(
          `UPDATE quytacluong SET 
                luong_ttv=@luong_ttv,
                luong_max_bhxh_bhyt=@luong_max_bhxh_bhyt,
                luong_max_bhtn=@luong_max_bhtn,
                songay_tinhluong=@songay_tinhluong,
                sogio_tinhluong=@sogio_tinhluong,
                tl_lamthem_thuong_bn=@tl_lamthem_thuong_bn,
                tl_lamthem_nghi_bn=@tl_lamthem_nghi_bn,
                tl_lamthem_le_bn=@tl_lamthem_le_bn,
                tl_lamthem_thuong_bd=@tl_lamthem_thuong_bd,
                tl_lamthem_nghi_bd=@tl_lamthem_nghi_bd,
                tl_lamthem_le_bd=@tl_lamthem_le_bd,
                tl_dong_bhxh_ct=@tl_dong_bhxh_ct,
                tl_dong_bhyt_ct=@tl_dong_bhyt_ct,
                tl_dong_bhtn_ct=@tl_dong_bhtn_ct,
                tl_dong_cd_ct=@tl_dong_cd_ct,
                tl_dong_bhxh_cn=@tl_dong_bhxh_cn,
                tl_dong_bhyt_cn=@tl_dong_bhyt_cn,
                tl_dong_bhtn_cn=@tl_dong_bhtn_cn,
                tl_dong_cd_cn=@tl_dong_cd_cn,
                thue_tncn_gtcn=@thue_tncn_gtcn,
                thue_tncn_gtnt=@thue_tncn_gtnt          
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

// cập nhật lô sản xuất
router.patch("/updatelsx/:_id", async (req, res) => {
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
        .input("mapx", req.body.mapx)
        .input("tenpx", req.body.tenpx)
        .input("makh", req.body.makh)
        .input("ngaybd", req.body.ngaybd)
        .input("ngaykt", req.body.ngaykt)
        .input("sldathang", req.body.sldathang)
        .input("slsanxuat", req.body.slsanxuat)
        .input("masp", req.body.masp)
        .input("tensp", req.body.tensp)
        .input("soluong", req.body.soluong)
        .input("nhomluong", req.body.nhomluong)
        .input("malosx", req.body.malosx)
        .input("soluonglsx", req.body.soluonglsx)
        .input("slthuctetaixuong", req.body.slthuctetaixuong)
        .input("startday", req.body.startday)
        .input("stopday", req.body.stopday)
        .input("ghichu", req.body.ghichu)
        .input("createdAt", req.body.createdAt)
        .input("createdBy", req.body.createdBy)
        .input("status", req.body.status)
        .input("tongdat", req.body.tongdat)
        .input("tonghong", req.body.tonghong)
        .query(
          `UPDATE losanxuat SET 
                mapx=@mapx,
                tenpx=@tenpx,
                makh=@makh,
                ngaybd=@ngaybd,
                ngaykt=@ngaykt,
                sldathang=@sldathang,
                slsanxuat=@slsanxuat,
                masp=@masp,
                tensp=@tensp,
                soluong=@soluong,
                nhomluong=@nhomluong,
                malosx=@malosx,
                soluonglsx=@soluonglsx,
                slthuctetaixuong=@slthuctetaixuong,
                startday=@startday,
                stopday=@stopday,
                ghichu=@ghichu,
                createdAt=@createdAt,
                createdBy=@createdBy,
                status=@status,
                tongdat=@tongdat,
                tonghong=@tonghong  
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

router.post("/taophieuung", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nguoiung", req.body.nguoiung)
      .input("tienung", req.body.tienung)
      .input("ngayung", req.body.ngayung)
      .input("noidung", req.body.noidung)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("mapb", req.body.mapb)
      .input("phongban", req.body.phongban)
      .input("manv", req.body.manv)
      .input("typeung", req.body.typeung)
      .input("hoanung", req.body.hoanung).query(`
                      INSERT INTO ungtien (nguoiung, tienung, ngayung, noidung,createdAt, createdBy, mapb, phongban, manv, typeung, hoanung) 
                      VALUES (@nguoiung, @tienung, @ngayung, @noidung,@createdAt, @createdBy, @mapb, @phongban, @manv, @typeung, @hoanung);
                  `);
    const ungtien = req.body;
    res.json(ungtien);
  } catch (error) {
    res.status(500).json(error);
  }
});

// thêm ăn ca
router.post("/addanca", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("anca", req.body.anca)
      .input("tienan", req.body.tienan)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO buatrua (anca, tienan, ghichu, createdAt, createdBy) 
                      VALUES (@anca, @tienan, @ghichu, @createdAt, @createdBy);
                  `);
    const anca = req.body;
    // res.json(anca);
    res.json({
      success: true,
      message: "Update success !",
      data: anca,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// thêm định mức ngoài giờ
router.post("/adddinhmucngoaigio", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("noidung", req.body.noidung)
      .input("muctien", req.body.muctien)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO dinhmucngoaigio (noidung, muctien, ghichu, createdAt, createdBy) 
                      VALUES (@noidung, @muctien, @ghichu, @createdAt, @createdBy);
                  `);
    const dmng = req.body;
    // res.json(anca);
    res.json({
      success: true,
      message: "Update success !",
      data: dmng,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// thêm chấm ngoài giờ
router.post("/addchamcongngoaigio", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapb", req.body.mapb)
      .input("tenpb", req.body.tenpb)
      .input("manv", req.body.manv)
      .input("tennv", req.body.tennv)
      .input("muctien", req.body.muctien)
      .input("sogio", req.body.sogio)
      .input("ngaylam", req.body.ngaylam)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO ngoaigio (mapb, tenpb, manv, tennv, muctien, sogio, ngaylam, ghichu, createdAt, createdBy) 
                      VALUES (@mapb, @tenpb, @manv, @tennv, @muctien, @sogio, @ngaylam, @ghichu, @createdAt, @createdBy);
                  `);
    const dmng = req.body;
    // res.json(anca);
    res.json({
      success: true,
      message: "Update success !",
      data: dmng,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/themluongthang", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("mapb", req.body.mapb)
      .input("tenpb", req.body.tenpb)
      .input("mato", req.body.mato)
      .input("manv", req.body.manv)
      .input("hotennv", req.body.hotennv)
      .input("chucvu", req.body.chucvu)
      .input("luongcb", req.body.luongcb)
      .input("luongmem", req.body.luongmem)
      .input("luongqlsp", req.body.luongqlsp)
      .input("luongcd", req.body.luongcd)
      .input("luongps", req.body.luongps)
      .input("tongluong", req.body.tongluong)
      .input("antrua", req.body.antrua)
      .input("songaycong", req.body.songaycong)
      .input("ngayhotro", req.body.ngayhotro)
      .input("tienhotro", req.body.tienhotro)
      .input("bhxh", req.body.bhxh)
      .input("congdoan", req.body.congdoan)
      .input("tamung", req.body.tamung)
      .input("tongtru", req.body.tongtru)
      .input("tongnhan", req.body.tongnhan)
      .input("tienphat", req.body.tienphat)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("thang", req.body.thang)
      .input("nam", req.body.nam)
      .input("key_thangnam", req.body.key_thangnam)
      .input("status", req.body.status)
      .input("stk", req.body.stk)
      .input("chutaikhoan", req.body.chutaikhoan)
      .input("tennganhang", req.body.tennganhang)
      .input("nhanl1", req.body.nhanl1)
      .input("nhanl2", req.body.nhanl2)
      .input("nhanl3", req.body.nhanl3)
      .input("nhanl4", req.body.nhanl4)
      .input("nhanl5", req.body.nhanl5)
      .input("nhanl6", req.body.nhanl6)
      .input("sttchon", req.body.sttchon).query(`
                      INSERT INTO luongthang (mapb, tenpb, mato, manv, hotennv, chucvu, luongcb, luongmem, luongqlsp, luongcd, luongps, tongluong, antrua, songaycong, ngayhotro, tienhotro, bhxh, congdoan, tamung, tongtru, tongnhan, tienphat, createdAt, createdBy, thang, nam, key_thangnam, status, stk, chutaikhoan, tennganhang, nhanl1, nhanl2, nhanl3, nhanl4, nhanl5, nhanl6, sttchon) 
                      VALUES (@mapb, @tenpb, @mato, @manv, @hotennv, @chucvu, @luongcb, @luongmem, @luongqlsp, @luongcd, @luongps, @tongluong, @antrua, @songaycong, @ngayhotro, @tienhotro, @bhxh, @congdoan, @tamung, @tongtru, @tongnhan, @tienphat, @createdAt, @createdBy, @thang, @nam, @key_thangnam, @status, @stk, @chutaikhoan, @tennganhang, @nhanl1, @nhanl2, @nhanl3, @nhanl4, @nhanl5, @nhanl6, @sttchon);
                  `);
    const bl = req.body;
    // res.json(bl);
    res.json({
      success: true,
      message: "Update success !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/themluongthangvanphong", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("mapb", req.body.mapb)
      .input("tenpb", req.body.tenpb)
      .input("manv", req.body.manv)
      .input("hotennv", req.body.hotennv)
      .input("chucvu", req.body.chucvu)
      .input("mucluong", req.body.mucluong)
      .input("luongthang", req.body.luongthang)
      .input("luongtrachnhiem", req.body.luongtrachnhiem)
      .input("bacluong", req.body.bacluong)
      .input("ngaycong", req.body.ngaycong)
      .input("luongngaycong", req.body.luongngaycong)
      .input("dieuchinhdt", req.body.dieuchinhdt)
      .input("thuongdt", req.body.thuongdt)
      .input("phat", req.body.phat)
      .input("luongngoaigio", req.body.luongngoaigio)
      .input("sogiongoaigio", req.body.sogiongoaigio)
      .input("sogiongoaigiochunhat", req.body.sogiongoaigiochunhat)
      .input("hotro", req.body.hotro)
      .input("tongluong", req.body.tongluong)
      .input("bhxh", req.body.bhxh)
      .input("congdoan", req.body.congdoan)
      .input("tongkt", req.body.tongkt)
      .input("luongnhan", req.body.luongnhan)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("thang", req.body.thang)
      .input("nam", req.body.nam)
      .input("key_thangnam", req.body.key_thangnam)
      .input("status", req.body.status)
      .input("stk", req.body.stk)
      .input("tennganhang", req.body.tennganhang).query(`
                      INSERT INTO luongthang_vp (mapb, tenpb, manv, hotennv, chucvu, mucluong, luongthang, 
                        luongtrachnhiem, bacluong, ngaycong, luongngaycong, dieuchinhdt, thuongdt, phat, 
                        luongngoaigio, sogiongoaigio, sogiongoaigiochunhat, hotro, tongluong, bhxh, congdoan, tongkt, luongnhan, 
                        createdAt, createdBy, thang, nam, key_thangnam, status, stk, tennganhang) 
                      VALUES (@mapb, @tenpb, @manv, @hotennv, @chucvu, @mucluong, @luongthang, 
                        @luongtrachnhiem, @bacluong, @ngaycong, @luongngaycong, @dieuchinhdt, @thuongdt, 
                        @phat, @luongngoaigio, @sogiongoaigio, @sogiongoaigiochunhat, @hotro, @tongluong, @bhxh, @congdoan, @tongkt, 
                        @luongnhan, @createdAt, @createdBy, @thang, @nam, @key_thangnam, @status, @stk,
                         @tennganhang);
                  `);
    const bl = req.body;
    // res.json(bl);
    res.json({
      success: true,
      message: "Update success !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// thêm lương công đoạn
router.post("/addluongcongdoan", async (req, res) => {
  try {
    // console.log(req.body.createdBy)
    // console.log(req.body.createdAt)
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.body._id_losx)
      .input("kehoachnam", req.body.kehoachnam)
      .input("malonhamay", req.body.malonhamay)
      .input("makhpx", req.body.makhpx)
      .input("malosx", req.body.malosx)
      .input("mapx", req.body.mapx)
      .input("mato", req.body.mato)
      .input("masp", req.body.masp)
      .input("tensp", req.body.tensp)
      .input("nguyencong", req.body.nguyencong)
      .input("dongia", req.body.dongia)
      .input("may", req.body.may)
      .input("phanxuong_cn", req.body.phanxuong_cn)
      .input("to_cn", req.body.to_cn)
      .input("congnhan", req.body.congnhan)
      .input("tencn", req.body.tencn)
      .input("sodat", req.body.sodat)
      .input("sohong", req.body.sohong)
      .input("ghichu", req.body.ghichu)
      .input("stopday_losx", req.body.stopday_losx)
      .input("status", req.body.status)
      .input("executedAt", req.body.executedAt)
      .input("ngaythuchien", req.body.ngaythuchien)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO luongcongnhan (_id_losx, kehoachnam, malonhamay, makhpx, malosx,mapx, mato,masp,tensp, nguyencong, dongia, may, phanxuong_cn, to_cn, congnhan, tencn, sodat, sohong, ghichu, stopday_losx, status, executedAt, ngaythuchien, createdAt, createdBy) 
                      VALUES (@_id_losx, @kehoachnam, @malonhamay, @makhpx, @malosx, @mapx, @mato, @masp, @tensp, @nguyencong, @dongia, @may, @phanxuong_cn, @to_cn, @congnhan, @tencn, @sodat, @sohong, @ghichu, @stopday_losx, @status, @executedAt, @ngaythuchien, @createdAt, @createdBy);
                  `);
    const lc = req.body;
    res.json(lc);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Thêm công nhật
router.post("/addcongnhat", async (req, res) => {
  try {
    // console.log(req.body)
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.body._id_losx)
      .input("kehoachnam", req.body.kehoachnam)
      .input("malonhamay", req.body.malonhamay)
      .input("makhpx", req.body.makhpx)
      .input("masp", req.body.masp)
      .input("tensp", req.body.tensp)
      .input("mapx", req.body.mapx)
      .input("malosx", req.body.malosx)
      .input("macongnhat", req.body.macongnhat)
      .input("tencongnhat", req.body.tencongnhat)
      .input("macongnhan", req.body.macongnhan)
      .input("nguoithuchien", req.body.nguoithuchien)
      .input("sogiocong", req.body.sogiocong)
      .input("dongia", req.body.dongia)
      .input("ghichu", req.body.ghichu)
      .input("ngaythuchien", req.body.ngaythuchien)
      .input("status", 0)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO congnhat (_id_losx, kehoachnam,malonhamay, makhpx, masp, tensp, mapx, malosx, macongnhat, tencongnhat, macongnhan, nguoithuchien, sogiocong, dongia, ghichu, ngaythuchien, status, createdAt, createdBy) 
                      VALUES (@_id_losx, @kehoachnam, @malonhamay, @makhpx, @masp, @tensp, @mapx, @malosx, @macongnhat, @tencongnhat, @macongnhan, @nguoithuchien, @sogiocong, @dongia, @ghichu, @ngaythuchien, @status, @createdAt, @createdBy);
                  `);
    const lcn = req.body;
    res.json(lcn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Thêm phiếu lô sản xuất
router.post("/addphieulosx", async (req, res) => {
  try {
    // console.log(req.body)
    await pool.connect();
    await pool
      .request()
      .input("_id_khnam", req.body._id_khnam)
      .input("_id_lonhamay", req.body._id_lonhamay)
      .input("_id_khpx", req.body._id_khpx)
      .input("kehoachnam", req.body.kehoachnam)
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
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("status", req.body.status)
      .input("status_tinhluong", req.body.status_tinhluong)
      .input("datinhluong", req.body.datinhluong)
      .input("stopday_losx", req.body.stopday_losx)
      .input("tongdat", req.body.tongdat)
      .input("tonghong", req.body.tonghong)
      .input("nhomsp", req.body.nhomsp)
      .input("ghichu", req.body.ghichu).query(`
                      INSERT INTO losanxuat (_id_khnam, _id_lonhamay, _id_khpx, kehoachnam, malonhamay, makhpx, malosx, mapx, tenpx, mato, tento, masp, tensp, soluong, nhomluong, soluonglsx, soluongkhsx, ngaybd, ngaykt, createdAt, createdBy, status, status_tinhluong, datinhluong, stopday_losx, tongdat, tonghong, nhomsp, ghichu)
                      VALUES (@_id_khnam, @_id_lonhamay, @_id_khpx, @kehoachnam, @malonhamay, @makhpx, @malosx, @mapx, @tenpx, @mato, @tento, @masp, @tensp, @soluong, @nhomluong, @soluonglsx, @soluongkhsx, @ngaybd, @ngaykt, @createdAt, @createdBy, @status, @status_tinhluong, @datinhluong, @stopday_losx, @tongdat, @tonghong, @nhomsp, @ghichu);
                  `);

    const result = await pool
      .request()
      .query("SELECT TOP 1 * FROM losanxuat ORDER BY _id DESC");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Thêm phiếu lô kế hoạch
router.post("/addphieulokh", async (req, res) => {
  try {
    // console.log(req.body)
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khnam", req.body._id_khnam)
      .input("kehoachnam", req.body.kehoachnam)
      .input("malonhamay", req.body.malonhamay)
      .input("soluong", req.body.soluong)
      .input("sldathang", req.body.sldathang)
      .input("slsanxuat", req.body.slsanxuat)
      .input("tuanbd", req.body.tuanbd)
      .input("tuankt", req.body.tuankt)
      .input("ngaybd", req.body.ngaybd)
      .input("ngaykt", req.body.ngaykt)
      .input("mathanhpham", req.body.mathanhpham)
      .input("tenthanhpham", req.body.tenthanhpham)
      .input("nhomthanhpham", req.body.nhomthanhpham)
      .input("status", req.body.status)
      .input("ngaybatdautt", req.body.ngaybatdautt)
      .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("updatedAt", req.body.updatedAt)
      .input("createdBy", req.body.createdBy).query(`
                      INSERT INTO lokehoach (_id_khnam,kehoachnam,malonhamay,soluong,sldathang,slsanxuat,tuanbd,tuankt,ngaybd,ngaykt,mathanhpham,tenthanhpham,nhomthanhpham,status,ngaybatdautt,ngayhoanthanhtt,ghichu,createdAt,updatedAt,createdBy) 
                      VALUES (@_id_khnam,@kehoachnam,@malonhamay,@soluong,@sldathang,@slsanxuat,@tuanbd,@tuankt,@ngaybd,@ngaykt,@mathanhpham,@tenthanhpham,@nhomthanhpham,@status,@ngaybatdautt,@ngayhoanthanhtt,@ghichu,@createdAt,@updatedAt,@createdBy);
                  `);
    const lc = req.body;
    res.json(lc);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Thêm phiếu lô kế hoạch phân xưởng
router.post("/addphieulokhpx", async (req, res) => {
  try {
    // console.log(req.body)
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khnam", req.body._id_khnam)
      .input("_id_lonhamay", req.body._id_lonhamay)
      .input("kehoachnam", req.body.kehoachnam)
      .input("malonhamay", req.body.malonhamay)
      .input("soluonglonm", req.body.soluonglonm)
      .input("tuanbdlonm", req.body.tuanbdlonm)
      .input("tuanktlonm", req.body.tuanktlonm)
      .input("ngaybdlonm", req.body.ngaybdlonm)
      .input("ngayktlonm", req.body.ngayktlonm)
      .input("mathanhpham", req.body.mathanhpham)
      .input("tenthanhpham", req.body.tenthanhpham)
      .input("nhomthanhpham", req.body.nhomthanhpham)
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("maspkhpx", req.body.maspkhpx)
      .input("tenspkhpx", req.body.tenspkhpx)
      .input("nhomspkhpx", req.body.nhomspkhpx)
      .input("makhpx", req.body.makhpx)
      .input("soluongkhpx", req.body.soluongkhpx)
      .input("tuanbdkhpx", req.body.tuanbdkhpx)
      .input("tuanktkhpx", req.body.tuanktkhpx)
      .input("ngaybdkhpx", req.body.ngaybdkhpx)
      .input("ngayktkhpx", req.body.ngayktkhpx)
      .input("tuanbdthucte", req.body.tuanbdthucte)
      .input("tuanktthucte", req.body.tuanktthucte)
      .input("ngaybdthucte", req.body.ngaybdthucte)
      .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
      .input("ttqt", req.body.ttqt)
      .input("nhomluong", req.body.nhomluong)
      .input("status", req.body.status)
      .input("tongdat", req.body.tongdat)
      .input("tonghong", req.body.tonghong)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("updatedAt", req.body.updatedAt)
      .input("createdBy", req.body.createdBy)
      .input("congsuat", req.body.congsuat)
      .input("songay", req.body.songay)
      .input("may", req.body.may).query(`
                      INSERT INTO lokehoachphanxuong (_id_khnam, _id_lonhamay, kehoachnam, malonhamay, soluonglonm, tuanbdlonm,	tuanktlonm,	ngaybdlonm,	ngayktlonm,	mathanhpham, tenthanhpham, nhomthanhpham,	mapx,	tenpx, mato, tento,	maspkhpx,	tenspkhpx, nhomspkhpx, makhpx,	soluongkhpx, tuanbdkhpx, tuanktkhpx,	ngaybdkhpx,	ngayktkhpx,	tuanbdthucte,	tuanktthucte,	ngaybdthucte, ngayhoanthanhtt, ttqt, nhomluong, status, tongdat, tonghong, ghichu, createdAt, updatedAt, createdBy, congsuat, songay, may) 
                      VALUES (@_id_khnam,	@_id_lonhamay, @kehoachnam,	@malonhamay, @soluonglonm, @tuanbdlonm,	@tuanktlonm, @ngaybdlonm,	@ngayktlonm, @mathanhpham, @tenthanhpham,	@nhomthanhpham,	@mapx, @tenpx, @mato,	@tento,	@maspkhpx, @tenspkhpx, @nhomspkhpx, @makhpx,	@soluongkhpx,	@tuanbdkhpx, @tuanktkhpx,	@ngaybdkhpx, @ngayktkhpx, @tuanbdthucte, @tuanktthucte,	@ngaybdthucte, @ngayhoanthanhtt, @ttqt,	@nhomluong,	@status, @tongdat, @tonghong, @ghichu,	@createdAt,	@updatedAt,	@createdBy,	@congsuat, @songay, @may);
                  `);
    const lc = req.body;
    res.json(lc);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Thêm phiếu lô kế hoạch mùa vụ
// Lập kế hoạch nhà máy
router.post("/lapkehoachmuavu", async (req, res) => {
  try {
    // console.log(req.body)
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.body.makh)
      .input("makhmv", req.body.makhmv)
      .input("mota", req.body.mota)
      .input("masp", req.body.masp)
      .input("tensp", req.body.tensp)
      .input("nhomsp", req.body.nhomsp)
      .input("soluong", req.body.soluong)
      .input("soluongmuavu", req.body.soluongmuavu)
      .input("tgbatdau", req.body.tgbatdau)
      .input("tgketthuc", req.body.tgketthuc)
      .input("khachhang", req.body.khachhang)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("status", req.body.status).query(`
                      INSERT INTO kehoachmuavu (makh, makhmv, mota, masp, tensp, nhomsp, soluong, soluongmuavu, tgbatdau, tgketthuc, khachhang, ghichu, createdAt, createdBy, status) 
                      VALUES (@makh, @makhmv, @mota, @masp, @tensp, @nhomsp, @soluong, @soluongmuavu, @tgbatdau, @tgketthuc, @khachhang, @ghichu, @createdAt, @createdBy, @status);
                  `);
    const lc = req.body;
    res.json(lc);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Lập kế hoạch nhà máy
router.post("/lapkhnhamay", async (req, res) => {
  try {
    // console.log(req.body)
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.body.makh)
      .input("mathanhpham", req.body.mathanhpham)
      .input("tenthanhpham", req.body.tenthanhpham)
      .input("nhomthanhpham", req.body.nhomthanhpham)
      .input("soluong", req.body.soluong)
      .input("tgbatdau", req.body.tgbatdau)
      .input("tgketthuc", req.body.tgketthuc)
      .input("makhachhang", req.body.makhachhang)
      .input("khachhang", req.body.khachhang)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("status", req.body.status)
      .input("soluongmuavup1", req.body.soluongmuavup1)
      .input("soluongmuavup2", req.body.soluongmuavup2)
      .input("soluongmuavup3", req.body.soluongmuavup3)
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
      .input("slthang12", req.body.slthang12).query(`
                      INSERT INTO kehoach (makh, mathanhpham, tenthanhpham, nhomthanhpham, soluong, tgbatdau, tgketthuc, makhachhang, khachhang, ghichu, createdAt, createdBy, status, soluongmuavup1, soluongmuavup2, soluongmuavup3, slthang1, slthang2, slthang3, slthang4, slthang5, slthang6, slthang7, slthang8, slthang9, slthang10, slthang11, slthang12) 
                      VALUES (@makh, @mathanhpham, @tenthanhpham, @nhomthanhpham, @soluong, @tgbatdau, @tgketthuc, @makhachhang, @khachhang, @ghichu, @createdAt, @createdBy, @status, @soluongmuavup1, @soluongmuavup2, @soluongmuavup3, @slthang1, @slthang2, @slthang3, @slthang4, @slthang5, @slthang6, @slthang7, @slthang8, @slthang9, @slthang10, @slthang11, @slthang12);
                  `);
    const lc = req.body;
    res.json(lc);
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật công đoạn lương cho công nhân
router.patch("/updatesodatsohonglcd/:_id", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM luongcongnhan WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("sohong", req.body.sohong)
        .input("sodat", req.body.sodat)
        .query(
          `UPDATE luongcongnhan SET 
                sohong=@sohong,
                sodat=@sodat      
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

// add chi trả lương tháng
router.post("/addchitraluongthang", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("mapb", req.body.mapb)
      .input("tenpb", req.body.tenpb)
      .input("mato", req.body.mato)
      .input("manv", req.body.manv)
      .input("hotennv", req.body.hotennv)
      .input("tongnhan", req.body.tongnhan)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("thang", req.body.thang)
      .input("nam", req.body.nam)
      .input("key_thangnam", req.body.key_thangnam)
      .input("status", req.body.status)
      .input("chutaikhoan", req.body.chutaikhoan)
      .input("tennganhang", req.body.tennganhang)
      .input("stk", req.body.stk)
      .input("chuyenkhoan", req.body.chuyenkhoan)
      .input("tienmat", req.body.tienmat)
      .input("ck1", req.body.ck1)
      .input("ck2", req.body.ck2)
      .input("ghichu", req.body.ghichu)
      .input("vanphong", req.body.vanphong)
      .input("sttchon", req.body.sttchon).query(`
                      INSERT INTO chitraluong (mapb, tenpb, mato, manv, hotennv, tongnhan, createdAt, createdBy, thang, nam, key_thangnam, status, chutaikhoan, tennganhang, stk, chuyenkhoan, tienmat, ck1, ck2, ghichu, vanphong, sttchon) 
                      VALUES (@mapb, @tenpb, @mato, @manv, @hotennv, @tongnhan, @createdAt, @createdBy, @thang, @nam, @key_thangnam, @status, @chutaikhoan, @tennganhang, @stk, @chuyenkhoan, @tienmat, @ck1, @ck2, @ghichu, @vanphong, @sttchon);
                  `);
    console.log(result);
    res.json({
      success: true,
      message: "Update success !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật ăn ca
router.patch("/anca/:_id", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM buatrua WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("anca", req.body.anca)
        .input("tienan", req.body.tienan)
        .input("ghichu", req.body.ghichu)
        .query(
          `UPDATE buatrua SET 
                anca=@anca,
                tienan=@tienan,
                ghichu=@ghichu      
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

// cập nhật định mức ngoài giờ
router.patch("/dinhmucng/:_id", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM dinhmucngoaigio WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("noidung", req.body.noidung)
        .input("muctien", req.body.muctien)
        .input("ghichu", req.body.ghichu)
        .query(
          `UPDATE dinhmucngoaigio SET 
                noidung=@noidung,
                muctien=@muctien,
                ghichu=@ghichu      
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

// cập nhật số đạt
router.patch("/updateluongcongdoansodat/:_id", async (req, res) => {
  try {
    // console.log(req.body.sodat);
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM luongcongnhan WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("sodat", req.body.sodat)
        .query(
          `UPDATE luongcongnhan SET 
                sodat=@sodat  
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

// lấy tổng số lượng trong lô sản xuất
router.get("/sumsoluonginlsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("makh", req.query.makh)
      .input("makhpx", req.query.makhpx)
      .input("mapx", req.query.mapx)
      .query(
        `select sum(cast(trim(soluong) as int)) total from losanxuat where makh=@makh and makhpx=@makhpx and mapx=@mapx`
      );
    const ktn = result.recordset;

    res.json(ktn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lấy keythangnam từ bảng luongthang
router.get("/getkeythangnam", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(key_thangnam) from luongthang`);
    const ktn = result.recordset;

    res.json(ktn);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/getkeythangnamvanphong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(key_thangnam) from luongthang_vp`);
    const ktn = result.recordset;

    res.json(ktn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lấy keythangnam từ bảng chitraluong
router.get("/getkeythangnam_chitraluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select distinct(key_thangnam) from chitraluong`);
    const ktn = result.recordset;

    res.json(ktn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// lấy keythangnam từ bảng luongthang
router.get("/getkeythangnamwithdata", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("key_thangnam", req.query.key_thangnam)
      .query(
        `select manv+'-'+hotennv+'-'+key_thangnam as keyfind from luongthang where key_thangnam=@key_thangnam`
      );
    const ktn = result.recordset;

    res.json(ktn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật status trong công đoạn lương
router.patch("/updatestatusluongcongdoan/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM luongcongnhan WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("status", req.body.status)
        .input("stopday_losx", req.body.stopday_losx)
        .query(
          `UPDATE luongcongnhan SET 
              status=@status,
              stopday_losx=@stopday_losx      
              WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật công nhật lương cho công nhân
router.patch("/updateluongcongnhat/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhat WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("sogiocong", req.body.sogiocong)
        .input("ghichu", req.body.ghichu)
        .query(
          `UPDATE congnhat SET 
                sogiocong=@sogiocong,
                ghichu=@ghichu          
              WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật tình trạng cho lô sản xuất
router.patch("/updatelosx/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("stopday_losx", req.body.stopday_losx)
        .input("status", req.body.status)
        .query(
          `UPDATE losanxuat SET 
                stopday_losx=@stopday_losx,
                status=@status          
              WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật tình trạng cho lương công đoạn
router.patch("/updateluongcdstatus", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM luongcongnhan WHERE _id = @_id`);
    let ut = result.recordset[0];
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("stopday_losx", req.body.stopday_losx)
        .input("status", req.body.status)
        .query(
          `UPDATE losanxuat SET 
                stopday_losx=@stopday_losx,
                status=@status          
              WHERE _id = @_id;`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật tình trạng cho LÔ sản xuất
router.patch("/capnhatstatuslosx/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id=@_id`);
    let ut = result.recordset[0];
    // console.log(ut)
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("status", req.body.status)
        .input("stopday_losx", req.body.stopday_losx)
        .input("status_tinhluong", req.body.status_tinhluong)
        .query(
          `UPDATE losanxuat SET 
                status=@status,
                stopday_losx=@stopday_losx,
                status_tinhluong=@status_tinhluong
              WHERE _id=@_id`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật tổng hỏng tổng đạt trong 1 lô sản xuất theo _id
router.patch("/updatetonghong", async (req, res) => {
  // console.log(req.body);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.query._id)
      .query(`SELECT * FROM losanxuat WHERE _id=@_id`);
    let ut = result.recordset[0];
    // console.log(ut);
    if (ut) {
      await pool
        .request()
        .input("_id", req.query._id)
        .input("tonghong", req.body.tonghong)
        .input("tongdat", req.body.tongdat)
        .input("ngayhoanthanhtt", req.body.ngayhoanthanhtt)
        .query(
          `UPDATE losanxuat SET 
                tonghong = @tonghong,
                tongdat = @tongdat,
                ngayhoanthanhtt = @ngayhoanthanhtt
              WHERE _id=@_id`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật tổng hỏng trong 1 lô sản xuất theo _id
router.patch("/updateonlytonghong", async (req, res) => {
  // console.log(req.body);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.query._id)
      .query(`SELECT * FROM losanxuat WHERE _id=@_id`);
    let ut = result.recordset[0];
    // console.log(ut);
    if (ut) {
      await pool
        .request()
        .input("_id", req.query._id)
        .input("tonghong", req.body.tonghong)
        .input("tongdat", req.body.tongdat)
        .query(
          `UPDATE losanxuat SET 
                tonghong = @tonghong,
                tongdat = @tongdat
              WHERE _id=@_id`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật tổng dat trong 1 lô sản xuất theo _id
router.patch("/updateonlytongdat", async (req, res) => {
  // console.log(req.body);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.query._id)
      .query(`SELECT * FROM losanxuat WHERE _id=@_id`);
    let ut = result.recordset[0];
    // console.log(ut);
    if (ut) {
      await pool
        .request()
        .input("_id", req.query._id)
        .input("tongdat", req.body.tongdat)
        .query(
          `UPDATE losanxuat SET 
              tongdat = @tongdat
              WHERE _id=@_id`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật mot so thong tin trong losanxuat
router.patch("/updatettlsx/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id=@_id`);
    let ut = result.recordset[0];
    // console.log(ut);
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("malosx", req.body.malosx)
        .input("ngaybd", req.body.ngaybd)
        .input("ngaykt", req.body.ngaykt)
        .input("soluonglsx", req.body.soluonglsx)
        .query(
          `UPDATE losanxuat SET 
                malosx = @malosx,
                ngaybd = @ngaybd,
                ngaykt = @ngaykt,
                soluonglsx = @soluonglsx
              WHERE _id=@_id`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật mot so thong tin trong losanxuat
router.patch("/updatesoluonglsx/:_id", async (req, res) => {
  try {
    console.log(req.body.soluonglsx);
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM losanxuat WHERE _id=@_id`);
    let ut = result.recordset[0];
    // console.log(ut);
    if (ut) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("soluonglsx", req.body.soluonglsx)
        .query(
          `UPDATE losanxuat SET 
                soluonglsx = @soluonglsx
              WHERE _id=@_id`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật chot phieu lo cho toan bo lo san xuat
router.patch("/capnhatstatuslcd/:_id_losx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.params._id_losx)
      .query(`SELECT * FROM luongcongnhan WHERE _id_losx=@_id_losx`);
    let ut = result.recordset[0];
    // console.log(ut);
    if (ut) {
      await pool
        .request()
        .input("_id_losx", req.params._id_losx)
        .input("stopday_losx", req.body.stopday_losx)
        .input("status", req.body.status)
        .query(
          `UPDATE luongcongnhan SET 
                stopday_losx=@stopday_losx,
                status=@status          
              WHERE _id_losx=@_id_losx`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Not found");
      res.json({
        success: false,
        message: "Không có dữ liệu để cập nhật !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật chot phieu lo cho toan bo lo san xuat
router.patch("/capnhatstatusluongcnhat/:_id_losx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.params._id_losx)
      .query(`SELECT * FROM congnhat WHERE _id_losx=@_id_losx`);
    let ut = result.recordset[0];
    // console.log(ut)
    if (ut) {
      await pool
        .request()
        .input("_id_losx", req.params._id_losx)
        .input("stopday_losx", req.body.stopday_losx)
        .input("status", req.body.status)
        .query(
          `UPDATE congnhat SET 
                stopday_losx=@stopday_losx,
                status=@status          
              WHERE _id_losx=@_id_losx`
        );
      res.json({
        success: true,
        message: "Update success !",
      });
    } else {
      console.log("Không tìm thấy lương công nhật");
      res.json({
        success: false,
        message: "Không có dữ liệu để cập nhật !",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data history
router.get("/allhis", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM history_action order by createdAt desc`);
    const his = result.recordset;

    res.json(his);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one luong cong nhan
router.get("/getoneluongcongnhan", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.query._id)
      .query(`SELECT * FROM luongcongnhan where _id=@_id`);
    const lcn = result.recordset;

    res.json(lcn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// to is nhom???
// get one luong cong nhan
router.get("/toornhom", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`select mapx from tonhom where mapx=@mapx`);
    const lcn = result.recordset;

    res.json(lcn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phieu lô tính lương công đoạn
router.get("/getallphieulsxtinhluongcd", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .input("mapx", req.query.mapx).query(`select * from losanxuat 
    where status_tinhluong=1 and
    year(stopday_losx)=@nam and month(stopday_losx)=@thang and mapx=@mapx order by _id, stopday_losx`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all chi tiết lương công đoạn
router.get("/detailallluongcongdoaninmonth", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .input("mapx", req.query.mapx).query(`select * from luongcongnhan 
where _id_losx in (select _id from losanxuat WHERE year(stopday_losx) = @nam and month(stopday_losx) = @thang
AND status_tinhluong =1 and datinhluong = 0)
and mapx=@mapx`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all chi tiết lương công nhật
router.get("/detailallluongcongnhatinmonth", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .input("mapx", req.query.mapx).query(`select * from congnhat 
where _id_losx in (select _id from losanxuat WHERE year(stopday_losx) = @nam and month(stopday_losx) = @thang
AND status_tinhluong =1 and datinhluong = 0)
and mapx=@mapx`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// hủy lương tháng
router.delete("/delluongthang", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("thang", req.query.thang)
      .input("nam", req.query.nam)
      .input("mapb", req.query.mapb)
      .query(
        `delete from luongthang where thang = @thang and nam = @nam and mapb=@mapb`
      );
    const ktn = result.recordset;

    res.json(ktn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// xem chi tiết lương công đoạn của từng công nhân
router.get("/detailluongcongdoancn", async (req, res) => {
  try {
    await pool.connect();
    const result = await // .input("mapx", req.query.mapx)
    //       .query(`select * from luongcongnhan where
    // _id_losx in (select _id from losanxuat where year(stopday_losx) = @nam and month(stopday_losx) = @thang)
    // and mapx=@mapx and congnhan=@congnhan order by stopday_losx`);
    pool
      .request()
      .input("congnhan", req.query.congnhan)
      .input("nam", req.query.nam)
      .input("thang", req.query.thang).query(`select * from luongcongnhan where 
_id_losx in (select _id from losanxuat where year(stopday_losx) = @nam and month(stopday_losx) = @thang)
and congnhan=@congnhan order by stopday_losx`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// xem chi tiết lương công nhật của từng công nhân
router.get("/detailluongcongnhatcn", async (req, res) => {
  try {
    await pool.connect();
    const result = await // .input("mapx", req.query.mapx)
    //       .query(`select * from congnhat where
    // _id_losx in (select _id from losanxuat where year(stopday_losx) = @nam and month(stopday_losx) = @thang)
    // and mapx=@mapx and macongnhan=@macongnhan order by stopday_losx`);
    pool
      .request()
      .input("macongnhan", req.query.macongnhan)
      .input("nam", req.query.nam)
      .input("thang", req.query.thang).query(`select * from congnhat where 
_id_losx in (select _id from losanxuat where year(stopday_losx) = @nam and month(stopday_losx) = @thang)
and macongnhan=@macongnhan order by stopday_losx`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// xem chi tiết ăn ca
router.get("/detailanca", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("congnhan", req.query.congnhan)
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .input("mapx", req.query.mapx).query(`select * from chamcong where 
mapx=@mapx and year(ngaychamcong)=@nam and month(ngaychamcong)=@thang and macn=@congnhan order by ngaychamcong`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// import ngoài giờ
router.post(
  "/importchamcongngoaigio",
  upload.single("file"),
  async (req, res) => {
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

      const table = new Table("ngoaigio");
      table.create = false;

      table.columns.add("mapb", NVarChar, { nullable: true });
      table.columns.add("tenpb", NVarChar, {
        nullable: true,
      });
      table.columns.add("manv", NVarChar, {
        nullable: true,
      });
      table.columns.add("tennv", NVarChar, { nullable: true });
      table.columns.add("muctien", NVarChar, {
        nullable: true,
      });
      table.columns.add("sogio", NVarChar, {
        nullable: true,
      });
      table.columns.add("ngaylam", Date, {
        nullable: true,
      });
      table.columns.add("ghichu", NVarChar, {
        length: "max",
        nullable: true,
      });
      table.columns.add("createdBy", NVarChar, {
        nullable: true,
      });
      table.columns.add("createdAt", Date, {
        nullable: true,
      });
      table.columns.add("status", Bit, {
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
          createdAt,
          createdBy,
          1
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
        success: true,
      });
    } else {
      console.log("File not found !");
    }
  }
);

// xem chi tiết chấm công nhân viên ngoài giờ
router.get("/detailchamngoaigio", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("manv", req.query.manv)
      .input("nam", req.query.nam)
      .input("thang", req.query.thang).query(`select * from ngoaigio where 
year(ngaylam)=@nam and month(ngaylam)=@thang and manv=@manv order by ngaylam`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get tên sản phẩm trong lập kế hoạch nhà máy
router.get("/gettenspkhnm", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mavt", req.query.mavt)
      .query(`SELECT tenvt, nhomsp FROM dmnc where mavt=@mavt`);
    const dgc = result.recordset;

    res.json(dgc);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục ăn ca
router.get("/getallanca", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM buatrua order by _id`);
    const at = result.recordset;

    res.json(at);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục ngoài giờ
router.get("/getdanhmucngoaigio", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM dinhmucngoaigio order by _id`);
    const at = result.recordset;

    res.json(at);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// dữ liệu chấm ngoài giờ
router.get("/getallngoaigio", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM ngoaigio order by ngaylam`);
    const at = result.recordset;

    res.json(at);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get tên sản phẩm trong lập kế hoạch
router.get("/gettensp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("mavt", req.query.mavt)
      .query(`SELECT tenvt FROM dmnc where mapx=@mapx and mavt=@mavt`);
    const dgc = result.recordset;

    res.json(dgc);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/getinfosp", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mavt", req.query.mavt)
      .query(`SELECT * FROM dmnc where mavt=@mavt`);
    const dgc = result.recordset;

    res.json(dgc);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get dm nguyen cong
router.get("/getnguyencong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("khsp", req.query.khsp)
      .input("px", req.query.px)
      .query(
        `SELECT * FROM dongiacong where khsp=@khsp and px=@px and congdoan is not null`
      );
    const dgc = result.recordset;

    res.json(dgc);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get nhóm lương
router.get("/getnhomluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("mavt", req.query.mavt)
      .query(`SELECT * FROM dmnc where mapx=@mapx and mavt=@mavt`);
    const dgc = result.recordset;

    res.json(dgc);
    // console.log(phongban);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get dm công nhật
router.get("/alldmcongnhat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM dmcongnhat`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phiếu lô with mã phân xưởng
router.get("/allphieulopx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(
        `SELECT * FROM lokehoach where mapx=@mapx order by createdAt desc`
      );
    const pl = result.recordset;

    res.json(pl);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phiếu lô kế hoạch
router.get("/allphieulokh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`select * from kehoach order by makh`);
    const pl = result.recordset;

    res.json(pl);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tim kiem lo san xuat theo khoang thoi gian de vao luong
// new ---------
router.get("/getlosxtheoky", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .query(
        `select * from losanxuat where mapx=@mapx and year(ngaybd)=@nam and month(ngaybd) = @thang and status=0 order by ngaybd`
      );
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all mã lô kế hoạch theo phân xưởng
router.get("/getallmalkhpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`SELECT * FROM lokehoach where mapx=@mapx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phiếu lô sản xuất
router.get("/allphieulosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM losanxuat order by malosx`);
    const pl = result.recordset;

    res.json(pl);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phiếu lô sản xuất tại màn vào lương công đoạn
router.get("/getallphieulocht", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      // .query(`SELECT * FROM losanxuat where status=2 order by mapx, malosx`);
      .query(
        `SELECT * FROM losanxuat where (status=2 or status=3) and status_tinhluong = 0 order by mapx, malosx`
      );
    const pl = result.recordset;

    res.json({
      data: pl,
      success: true,
      message: "load ok",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phiếu lô sản xuất tại màn chốt lương
router.get("/getallphieulosxatcholuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      // .query(`SELECT * FROM losanxuat where status=2 order by mapx, malosx`);
      .query(`SELECT * FROM losanxuat where status=3 order by ngayhoanthanhtt`);
    const pl = result.recordset;

    res.json({
      data: pl,
      success: true,
      message: "load ok",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all phiếu lô trong chức năng danh sách losx
router.get("/getallphieulo", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM losanxuat order by mapx, malosx`);
    const pl = result.recordset;

    res.json({
      data: pl,
      success: true,
      message: "load ok",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all mã lô sản xuất theo phân xưởng
router.get("/getallmalsxpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(`SELECT * FROM losanxuat where mapx=@mapx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

//
router.get("/checkcongnhat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.query._id_losx)
      .query(`SELECT * FROM congnhat where _id_losx=@_id_losx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one mã lô sản xuất theo mã lô sx
router.get("/getonemalosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("malosx", req.query.malosx)
      .query(`SELECT * FROM losanxuat where malosx=@malosx`);
    const lokehoach = result.recordset;

    res.json(lokehoach);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data nguyên công sơn
router.get("/allnguyencongson", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM nguyencong_son`);
    const ncs = result.recordset;

    res.json(ncs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all nhân sự lập bảng lương
router.get("/nhanvienbangluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().execute("lapbangluongthang");
    const his = result.recordset;

    res.json(his);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get quy tắc lương
router.get("/quytactinhluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM quytacluong`);
    const his = result.recordset;

    res.json(his);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all data ứng tiền
router.get("/allungtien", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM ungtien order by createdAt desc`);
    const ungtien = result.recordset;

    res.json(ungtien);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lương công đoạn trong loo sx
router.get("/getallluongcongdoaninlsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.query._id_losx)
      .query(
        `select * from luongcongnhan where _id_losx=@_id_losx order by nguyencong, congnhan`
      );
    const lcd = result.recordset;

    res.json(lcd);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// KIỂM TRA XEM TRONG LÔ KẾ HOẠCH PHÂN XƯỞNG CÓ BAO NHIÊU LôS=2
router.get("/checklosanxuatstussx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khpx", req.query._id_khpx)
      .query(`SELECT * FROM losanxuat WHERE _id_khpx=@_id_khpx`);
    const lcd = result.recordset;

    res.json(lcd);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// KIỂM TRA XEM TRONG LÔ KẾ HOẠCH PHÂN XƯỞNG CÓ BAO NHIÊU trang thai = sx
router.get("/checklosanxuatstussxtrangthai2", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_khpx", req.query._id_khpx)
      .query(`SELECT * FROM losanxuat WHERE _id_khpx=@_id_khpx and status=2`);
    const lcd = result.recordset;

    res.json(lcd);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// cập nhật lo kế hoạch tại phân xưởng cho ngaybdtt
router.patch("/updatelokehoachngaybdtt/:_id", async (req, res) => {
  try {
    // console.log(req.body.ngaybdthucte);
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
        .input("ngaybdthucte", req.body.ngaybdthucte)
        .query(
          `UPDATE lokehoachphanxuong SET 
                ngaybdthucte = @ngaybdthucte
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

// cập nhật ngày bắt đầu và ngày kết thúc cho lô sản xuất
router.patch("/updatengaybdngayktlosx/:_id", async (req, res) => {
  try {
    // console.log(req.body);
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
        .query(
          `UPDATE losanxuat SET 
                ngaybd = @ngaybd,
                ngaykt = @ngaykt
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

// KIỂM TRA XEM TRONG LÔ nhà máy có bao nhiêu lô khpx
router.get("/checklokhpxoflnm", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_lonhamay", req.query._id_lonhamay)
      .query(
        `select * from lokehoachphanxuong where _id_lonhamay=@_id_lonhamay`
      );
    const lcd = result.recordset;

    res.json(lcd);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all lương công nhật trong loo sx
router.get("/getallluongcongnhatinlsx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.query._id_losx)
      .query(`select * from congnhat where _id_losx=@_id_losx order by _id`);
    const lcd = result.recordset;

    res.json(lcd);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tính lương công đoạn theo phân xưởng
router.get("/getallluongcongdoanpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .input("mapx", req.query.mapx)
      .execute(`luongcongdoan_phanxuong`);
    const lcd = result.recordset;

    // res.json(lcd);
    //console.log(chucvu);
    res.json({
      success: true,
      data: lcd,
      message: "Update success !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// tính lương công đoạn theo tổ nhóm
router.get("/getallluongcongdoanto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("nam", req.query.nam)
      .input("thang", req.query.thang)
      .input("mato", req.query.mato)
      .execute(`luongcongdoan_to`);
    const lcd = result.recordset;

    // res.json(lcd);
    res.json({
      success: true,
      data: lcd,
      message: "Update success !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// load bảng lương văn phòng theo bảng chấm công
router.get("/loadluongchamcong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("month", req.query.month)
      .input("year", req.query.year)
      .input("makhoi", req.query.makhoi)
      .execute(`load_luongvp`);
    const luongvp = result.recordset;

    res.json(luongvp);
    //console.log(chucvu);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Tính tổng hỏng trong lô sản xuất theo mã lô
router.get("/sumtonghong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.query._id_losx)
      .query(
        `select sum(cast(trim(sohong) as int)) tonghong from luongcongnhan where _id_losx=@_id_losx`
      );
    const tonghong = result.recordset;

    res.json(tonghong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ăn trưa
// tính lương công nhân
router.get("/tienantrua", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`select * from buatrua`);
    const antrua = result.recordset;

    res.json(antrua);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ăn trưa
// tính lương công nhân
router.get("/getphieulosx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("malosx", req.query.malosx)
      .query(`select * from losanxuat where malosx=@malosx`);
    const pl = result.recordset;

    res.json(pl);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all công đoạn
router.get("/getphieulocongdoan", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      // .input("malosx", req.query.malosx)
      // .input("mapx", req.query.mapx)
      .input("_id_losx", req.query._id_losx)
      .query(
        `select * from luongcongnhan where _id_losx=@_id_losx order by _id`
      );
    const pl = result.recordset;

    res.json(pl);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all cấp bậc lương
router.get("/getallcapbacluong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`select * from capbacluong`);
    const pl = result.recordset;
    res.json(pl);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all công nhật
router.get("/getphieulocongnhat", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id_losx", req.query._id_losx)
      .query(`select * from congnhat where _id_losx=@_id_losx order by _id`);
    const cn = result.recordset;

    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get by id
router.get("/ungtien/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM ungtien WHERE _id = @_id`);
    const ut = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (ut) {
      res.json(ut);
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

// delete tiền ứng
router.delete("/tienung/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM ungtien WHERE _id = @_id`);
    let ungtien = result.recordset.length ? result.recordset[0] : null;
    if (ungtien) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM ungtien WHERE _id = @_id;`);
      res.json(ungtien);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete lương công nhật
router.delete("/congnhat/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhat WHERE _id = @_id`);
    let cn = result.recordset.length ? result.recordset[0] : null;
    if (cn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM congnhat WHERE _id = @_id;`);
      res.json(cn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete cấp bậc lương
router.delete("/capbacluong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM capbacluong WHERE _id = @_id`);
    let cn = result.recordset.length ? result.recordset[0] : null;
    if (cn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM capbacluong WHERE _id = @_id;`);
      res.json(cn);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ghi lại lịch sử thao tác trên phần mềm
router.post("/record-action", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("tenthaotac", req.body.tenthaotac)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("ghichu", req.body.ghichu).query(`
                          INSERT INTO history_action (tenthaotac, createdAt, createdBy, ghichu) 
                          VALUES (@tenthaotac, @createdAt, @createdBy, @ghichu);
                      `);
    const histac = req.body;
    res.json(histac);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/anca/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM buatrua WHERE _id = @_id`);
    let antrua = result.recordset.length ? result.recordset[0] : null;
    if (antrua) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM buatrua WHERE _id = @_id;`);
      res.json(antrua);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/ngoaigio/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM dinhmucngoaigio WHERE _id = @_id`);
    let antrua = result.recordset.length ? result.recordset[0] : null;
    if (antrua) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM dinhmucngoaigio WHERE _id = @_id;`);
      res.json(antrua);
    } else {
      res.status(404).json({
        message: "Không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/chamngoaigio/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM ngoaigio WHERE _id = @_id`);
    let antrua = result.recordset.length ? result.recordset[0] : null;
    if (antrua) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM ngoaigio WHERE _id = @_id;`);
      res.json(antrua);
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
