const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database/dbinfo");
const jwt = require("jsonwebtoken");
const verifyToken = require("../services/verify-token");
const multer = require("multer");

// báo cáo quân số
router.get("/baocaoquanso", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .execute("baocaoquanso");

    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// xem lai bao cao quan so
router.get("/xemlaibaocaoquanso", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .query(
        "select * from chamcongphanxuong where ngaychamcong=@ngaychamcong"
      );

    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// xem ngày chấm công và mapx đã tồn tại
router.get("/showngaychamcongandmapx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .input("mapx", req.query.mapx)
      .query(
        "select * from chamcong where ngaychamcong=@ngaychamcong and mapx=@mapx order by cast(sttchon as int)"
      );

    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// xem ngày chấm công và mato đã tồn tại
router.get("/showngaychamcongandmato", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .input("mato", req.query.mato)
      .query(
        "select * from chamcong where ngaychamcong=@ngaychamcong and mato=@mato"
      );

    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// show ma cong nhan trong toan bang congnhan
router.get("/showallmacn", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query("select macn from congnhan order by macn");
    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// show ma cong nhan tai phanxuong
router.get("/showmacninpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(
        "select macn from congnhan where mapx=@mapx and trangthai=1 order by macn"
      );
    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// show ma cong nhan tai to
router.get("/showmacninto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .query(
        "select macn from congnhan where mato=@mato and trangthai=1 order by macn"
      );
    const bcqs = result.recordset;
    res.json(bcqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chi tiet quan so
router.get("/detailquansowithdonvi", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .input("mapx", req.query.mapx)
      .query(
        "select * from chamcong where ngaychamcong=@ngaychamcong and mapx=@mapx order by machamcong"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chi tiet quan so tai to
router.get("/detailquansowithdonvito", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .input("mato", req.query.mato)
      .query(
        "select * from chamcong where ngaychamcong=@ngaychamcong and mato=@mato order by machamcong"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// bao cao thang theo phan xuong
router.get("/baocaothangtheopx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("startDate", req.query.startDate)
      .input("endDate", req.query.endDate)
      .query(
        "select * from chamcong where mapx=@mapx and ngaychamcong BETWEEN @startDate AND @endDate order by sttchon"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// báo cáo tổng hợp từng phân xưởng
router.get("/baocaotonghoptheophanxuong", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("tungay", req.query.tungay)
      .input("denngay", req.query.denngay)
      .execute("baocaochamcongtheopx");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// báo cáo tổng hợp từng tổ
router.get("/baocaotonghoptheoto", async (req, res) => {
  try {
    // console.log(req.body);
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .input("tungay", req.query.tungay)
      .input("denngay", req.query.denngay)
      .execute("baocaochamcongtheoto");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/showallcongnhanwitharrmacn", async (req, res) => {
  try {
    const macn = req.query.macn;
    // console.log(idlist);
    const strmacn = "'" + macn.join("','") + "'";
    // console.log(strmacn);

    await pool.connect();
    const result = await pool.request().query(
      `select * from congnhan where
         macn in (${strmacn}) `
    );
    const dgc = result.recordset;

    res.json({
      success: true,
      message: "load",
      data: dgc,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/updatethongtinbank", async (req, res) => {
  try {
    // console.log(req.query);
    const _id = req.query._id;
    const manv = req.query.manv;
    const key_thangnam = req.query.key_thangnam;
    const chutaikhoan = req.query.chutaikhoan;
    const tennganhang = req.query.tennganhang;
    const stk = req.query.stk;
    // console.log(_id, manv, key_thangnam, chutaikhoan, tennganhang, stk);
    await pool.connect();
    const result = await pool.request().query(
      `update luongthang set chutaikhoan='${chutaikhoan}', tennganhang='${tennganhang}', stk='${stk}' where
         _id = '${_id}' and manv='${manv}' and key_thangnam='${key_thangnam}'`
    );
    // const dgc = result.recordset;
    // console.log(result);
    res.json({
      success: true,
      message: "update thanh cong",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// bao cao thang theo to
router.get("/baocaothangtheoto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .input("startDate", req.query.startDate)
      .input("endDate", req.query.endDate)
      .query(
        "select * from chamcong where mato=@mato and ngaychamcong BETWEEN @startDate AND @endDate"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// báo cáo chấm công theo phân xưởng
router.get("/baocaochamcongthangphanxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .input("startDate", req.query.startDate)
      .input("endDate", req.query.endDate)
      .execute("bangchamcongthang_phanxuong");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// báo cáo chấm công theo tổ
router.get("/baocaochamcongthangto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .input("startDate", req.query.startDate)
      .input("endDate", req.query.endDate)
      .execute("bangchamcongthang_to");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all cong nhan tại danh mục công nhân. vẫn lấy những người trangthai=0
router.get("/allcongnhan2trangthai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query("select * from congnhan");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all cong nhan
router.get("/allcongnhan", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query("select * from congnhan where trangthai=1 order by mapx, macn");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all cong nhan with px
router.get("/allcongnhanpx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(
        "select * from congnhan where mapx=@mapx and trangthai=1 order by sttchon"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all cong nhan with px cả trang thai = 0 trong danh mục cn
router.get("/allcongnhanpx2trangthai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query("select * from congnhan where mapx=@mapx order by sttchon");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all cong nhan with ma to
router.get("/allcongnhanto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .query(
        "select * from congnhan where mato=@mato and trangthai=1 order by sttchon"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all cong nhan with ma to 2 trth
router.get("/allcongnhanto2trangthai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .query("select * from congnhan where mato=@mato order by sttchon");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// công nhân đã nghỉ việc theo tổ
router.get("/allcongnhannghiviectheoto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .query(
        "select * from congnhan where mato=@mato and trangthai=0 order by sttchon"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// công nhân đã nghỉ việc theo px
router.get("/allcongnhannghiviectheopx", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mapx", req.query.mapx)
      .query(
        "select * from congnhan where mapx=@mapx and trangthai=0 order by sttchon"
      );
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// công nhân đã nghỉ việc
router.get("/allcongnhannghiviec", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query("select * from congnhan where trangthai=0 order by sttchon");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get Log nhân sự
router.get("/getalllognhansu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query("select * from log_nhansu order by createdAt desc");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// distinct ngaychamcong
router.get("/getngaychamcongonsv", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mato", req.query.mato)
      .query("select distinct(ngaychamcong) from chamcong");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all bien ban vi pham
router.get("/getallvipham", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query("select * from hosovipham order by ngayxuphat desc");
    const cn = result.recordset;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// thêm công nhân
router.post("/addcongnhan", async (req, res) => {
  try {
    const luongcb = req.body.luongcb.toString().replace(/,/g, "");
    await pool.connect();
    const result = await pool
      .request()
      .input("macn", req.body.macn)
      .input("tencn", req.body.tencn)
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("sdt", req.body.sdt)
      .input("diachi", req.body.diachi)
      .input("cccd", req.body.cccd)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("chucvu", req.body.chucvu)
      .input("luongcb", luongcb)
      .input("nguoilienhe", req.body.nguoilienhe)
      .input("sotknh", req.body.sotknh)
      .input("tennh", req.body.tennh)
      .input("ghichu", req.body.ghichu)
      .input("luongmem", req.body.luongmem)
      .input("anluongqlsp", req.body.anluongqlsp)
      .input("luongqlsp", req.body.luongqlsp)
      .input("tyleqlsp", req.body.tyleqlsp)
      .input("ngayhotro", req.body.ngayhotro)
      .input("tienhotro", req.body.tienhotro)
      .input("antrua", req.body.antrua)
      .input("congdoan", req.body.congdoan)
      .input("trangthai", req.body.trangthai)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("chutaikhoan", req.body.chutaikhoan).query(`
                        INSERT INTO congnhan (macn, tencn, mapx, tenpx, sdt, diachi, cccd, mato, tento, chucvu, luongcb, nguoilienhe, sotknh, tennh, ghichu, luongmem, anluongqlsp, luongqlsp, tyleqlsp, ngayhotro, tienhotro, antrua, congdoan, trangthai, createdAt, createdBy, chutaikhoan) 
                        VALUES (@macn, @tencn, @mapx, @tenpx, @sdt, @diachi, @cccd, @mato, @tento, @chucvu, @luongcb, @nguoilienhe, @sotknh, @tennh, @ghichu, @luongmem, @anluongqlsp, @luongqlsp, @tyleqlsp, @ngayhotro, @tienhotro, @antrua, @congdoan, @trangthai, @createdAt, @createdBy, @chutaikhoan);
                    `);
    const cn = req.body;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }

  // } else {
  //   console.log("File not found !");
  // }
});

// thêm dữ liệu điều chuyển
router.post("/addcongnhandieuchuyen", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("macn", req.body.macn)
      .input("tencn", req.body.tencn)
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("sdt", req.body.sdt)
      .input("diachi", req.body.diachi)
      .input("cccd", req.body.cccd)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("chucvu", req.body.chucvu)
      .input("luongcb", req.body.luongcb)
      .input("nguoilienhe", req.body.nguoilienhe)
      .input("sotknh", req.body.sotknh)
      .input("tennh", req.body.tennh)
      .input("ghichu", req.body.ghichu)
      .input("trangthai", req.body.trangthai)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                        INSERT INTO dulieudieuchuyen (macn, tencn, mapx, tenpx, sdt, diachi, cccd, mato, tento, chucvu, luongcb, nguoilienhe, sotknh, tennh, ghichu, trangthai, createdAt, createdBy) 
                        VALUES (@macn, @tencn, @mapx, @tenpx, @sdt, @diachi, @cccd, @mato, @tento, @chucvu, @luongcb, @nguoilienhe, @sotknh, @tennh, @ghichu, @trangthai, @createdAt, @createdBy);
                    `);
    const cn = req.body;
    res.json(cn);
  } catch (error) {
    res.status(500).json(error);
  }
});

// add chấm công
router.post("/addchamcong", async (req, res) => {
  try {
    await pool.connect();
    await pool
      .request()
      .input("macn", req.body.macn)
      .input("tencn", req.body.tencn)
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("sttchon", req.body.sttchon)
      .input("machamcong", req.body.machamcong)
      .input("chamcong", req.body.chamcong)
      .input("anca", req.body.anca)
      .input("tienan", req.body.tienan)
      .input("thanhtien", req.body.thanhtien)
      .input("diengiai", req.body.diengiai)
      .input("ghichu", req.body.ghichu)
      .input("ngaychamcong", req.body.ngaychamcong)
      .input("tuanchamcong", req.body.tuanchamcong)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                        INSERT INTO chamcong (macn, tencn, mapx, tenpx, mato, tento, sttchon, machamcong, chamcong, anca, tienan, thanhtien, diengiai, ghichu, ngaychamcong, tuanchamcong, createdAt, createdBy) 
                        VALUES (@macn, @tencn, @mapx, @tenpx, @mato, @tento, @sttchon, @machamcong, @chamcong, @anca, @tienan, @thanhtien, @diengiai, @ghichu, @ngaychamcong, @tuanchamcong, @createdAt, @createdBy);
                    `);
    res.status(200).json({
      success: true,
      message: "Chấm công thành công !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// add chấm công phân xưởng
router.post("/addchamcongphanxuong", async (req, res) => {
  try {
    await pool.connect();
    await pool
      .request()
      .input("ngaychamcong", req.body.ngaychamcong)
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("tongnguoi", req.body.tongnguoi)
      .input("ca1hc", req.body.ca1hc)
      .input("ca23", req.body.ca23)
      .input("nghip", req.body.nghip)
      .input("nghim", req.body.nghim)
      .input("nghik", req.body.nghik)
      .input("nghix", req.body.nghix)
      .input("nghil", req.body.nghil)
      .input("tongnghi", req.body.tongnghi)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                        INSERT INTO chamcongphanxuong (ngaychamcong, mapx, tenpx, mato, tento, tongnguoi, ca1hc, ca23, nghip, nghim, nghik, nghix, nghil, tongnghi, ghichu, createdAt, createdBy) 
                        VALUES (@ngaychamcong, @mapx, @tenpx, @mato, @tento, @tongnguoi, @ca1hc, @ca23, @nghip, @nghim, @nghik, @nghix, @nghil, @tongnghi, @ghichu, @createdAt, @createdBy);
                    `);
    res.status(200).json({
      success: true,
      message: "Chấm công thành công !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// add vi pham
router.post("/lapbienbanvipham", async (req, res) => {
  try {
    await pool.connect();
    await pool
      .request()
      .input("ngayxuphat", req.body.ngayxuphat)
      .input("soqd", req.body.soqd)
      .input("mapx", req.body.mapx)
      .input("tenpx", req.body.tenpx)
      .input("mato", req.body.mato)
      .input("tento", req.body.tento)
      .input("macn", req.body.macn)
      .input("tencn", req.body.tencn)
      .input("chucvu", req.body.chucvu)
      .input("sdt", req.body.sdt)
      .input("diachi", req.body.diachi)
      .input("cccd", req.body.cccd)
      .input("noidung", req.body.noidung)
      .input("maloaivp", req.body.maloaivp)
      .input("loaivp", req.body.loaivp)
      .input("mamucdovp", req.body.mamucdovp)
      .input("mucdovp", req.body.mucdovp)
      .input("mamucdokl", req.body.mamucdokl)
      .input("mucdokl", req.body.mucdokl)
      .input("nguoikiemtra", req.body.nguoikiemtra)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                        INSERT INTO hosovipham (soqd,	ngayxuphat,	mapx,	tenpx,	mato,	tento,	macn,	tencn,	chucvu,	sdt,	diachi,	cccd,	noidung, maloaivp,	loaivp,	mamucdovp, mucdovp, mamucdokl, mucdokl, nguoikiemtra,	ghichu,createdAt, createdBy) 
                        VALUES (@soqd,	@ngayxuphat,	@mapx,	@tenpx,	@mato,	@tento,	@macn,	@tencn,	@chucvu,	@sdt,	@diachi,	@cccd,	@noidung, @maloaivp,	@loaivp,	@mamucdovp, @mucdovp, @mamucdokl, @mucdokl, @nguoikiemtra, @ghichu,	@createdAt, @createdBy);
                    `);
    res.status(200).json({
      success: true,
      message: "Lap bien ban thanh cong !",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// log nhan su
router.post("/addlognhansu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("logname", req.body.logname)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy).query(`
                        INSERT INTO log_nhansu (logname, createdAt, createdBy) 
                        VALUES (@logname, @createdAt, @createdBy);
                    `);
    const cn = req.body;
    res.json(cn);
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
      .query(`SELECT * FROM congnhan WHERE _id = @_id`);
    const congnhan = result.recordset.length ? result.recordset[0] : null;
    //const t = result.recordset[0].madonvi
    if (congnhan) {
      res.json(congnhan);
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhan WHERE _id = @_id`);
    let congnhan = result.recordset[0];
    if (congnhan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("macn", req.body.macn)
        .input("tencn", req.body.tencn)
        .input("mapx", req.body.mapx)
        .input("tenpx", req.body.tenpx)
        .input("sdt", req.body.sdt)
        .input("diachi", req.body.diachi)
        .input("cccd", req.body.cccd)
        .input("mato", req.body.mato)
        .input("tento", req.body.tento)
        .input("chucvu", req.body.chucvu)
        .input("nguoilienhe", req.body.nguoilienhe)
        .input("sotknh", req.body.sotknh)
        .input("trangthai", req.body.trangthai)
        .input("tennh", req.body.tennh)
        .input("ghichu", req.body.ghichu)
        .input("updatedAt", req.body.updatedAt)
        .input("chutaikhoan", req.body.chutaikhoan)
        .query(
          `UPDATE congnhan SET 
                macn = @macn, 
                tencn = @tencn,
                mapx = @mapx, 
                tenpx = @tenpx,
                sdt = @sdt,
                diachi = @diachi,
                cccd = @cccd,
                mato = @mato,
                tento = @tento,
                chucvu = @chucvu,
                nguoilienhe = @nguoilienhe,
                sotknh = @sotknh,
                trangthai = @trangthai,
                tennh = @tennh,
                ghichu = @ghichu,
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

// cập nhật chức vụ & lương mềm
router.patch("/chucvuluongmem/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhan WHERE _id = @_id`);
    let congnhan = result.recordset[0];
    if (congnhan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("chucvu", req.body.chucvu)
        .input("luongmem", req.body.luongmem)
        .input("machucvu", req.body.machucvu)
        .input("luongcb", req.body.luongcb)
        .input("anluongqlsp", req.body.anluongqlsp)
        .query(
          `UPDATE congnhan SET 
                chucvu = @chucvu, 
                luongmem = @luongmem,
                machucvu = @machucvu,
                luongcb = @luongcb,
                anluongqlsp = @anluongqlsp
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

// update status
router.patch("/updatetrangthaicongnhan/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhan WHERE _id = @_id`);
    let congnhan = result.recordset[0];
    if (congnhan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("trangthai", req.body.trangthai)
        .input("ghichu", req.body.ghichu)
        .query(
          `UPDATE congnhan SET 
                trangthai = @trangthai, 
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

// update chấm công
router.patch("/updatechamcong/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM chamcong WHERE _id = @_id`);
    let congnhan = result.recordset[0];
    if (congnhan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("machamcong", req.body.machamcong)
        .input("chamcong", req.body.chamcong)
        .query(
          `UPDATE chamcong SET 
                machamcong = @machamcong, 
                chamcong = @chamcong
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

// update ăn ca
router.patch("/updateanca/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM chamcong WHERE _id = @_id`);
    let congnhan = result.recordset[0];
    if (congnhan) {
      await pool
        .request()
        .input("_id", req.params._id)
        .input("anca", req.body.anca)
        .input("tienan", req.body.tienan)
        .query(
          `UPDATE chamcong SET 
                anca = @anca, 
                tienan = @tienan
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

// delete chấm công phân xưởng
router.delete("/ngaychamcongphanxuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .input("mapx", req.query.mapx)
      .query(
        `SELECT * FROM chamcong WHERE ngaychamcong = @ngaychamcong and mapx=@mapx`
      );
    let chamcongngay = result.recordset.length ? result.recordset[0] : null;
    console.log(chamcongngay);
    if (chamcongngay) {
      await pool
        .request()
        .input("ngaychamcong", req.query.ngaychamcong)
        .input("mapx", req.query.mapx)
        .query(
          `DELETE FROM chamcong WHERE ngaychamcong = @ngaychamcong and mapx=@mapx;`
        );
      res.json({
        data: chamcongngay,
        success: true,
        message: "Xóa thành công",
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

// delete chấm công tổ
router.delete("/ngaychamcongto", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("ngaychamcong", req.query.ngaychamcong)
      .input("mato", req.query.mato)
      .query(
        `SELECT * FROM chamcong WHERE ngaychamcong = @ngaychamcong and mato=@mato`
      );
    let chamcongngay = result.recordset.length ? result.recordset[0] : null;
    if (chamcongngay) {
      await pool
        .request()
        .input("ngaychamcong", req.query.ngaychamcong)
        .input("mato", req.query.mato)
        .query(
          `DELETE FROM chamcong WHERE ngaychamcong = @ngaychamcong and mato=@mato;`
        );
      res.json({
        data: chamcongngay,
        success: true,
        message: "Xóa thành công",
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

// delete chấm công
router.delete("/chamcongid/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM chamcong WHERE _id = @_id`);
    let cn = result.recordset.length ? result.recordset[0] : null;
    if (cn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM chamcong WHERE _id = @_id;`);
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

// delete công nhan
router.delete("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM congnhan WHERE _id = @_id`);
    let cn = result.recordset.length ? result.recordset[0] : null;
    if (cn) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM congnhan WHERE _id = @_id;`);
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

module.exports = router;
