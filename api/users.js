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
    cb(null, "E:\\CODE_APP\\TEAMGIT\\client\\static\\avatar");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

/* Get all users */
router.get("/", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM users order by createdAt desc`);
    const users = result.recordset;

    res.json(users);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Get all role */
router.get("/role", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM role`);
    const role = result.recordset;

    res.json(role);
    //console.log(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Get email */
router.get("/findemail", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("email", req.query.email)
      .query(`SELECT * FROM users WHERE email = @email`);
    const email = result.recordset;
    res.json(email);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Get user by id */
router.get("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM users WHERE _id = @_id`);
    const user = result.recordset[0];
    if (!user) {
      res.status(403).json({
        success: false,
        message: "Authenticate failed, not found user",
      });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Cập nhật 1 user thường không qua auth */
router.patch("/user/:_id", upload.single("avatar"), async (req, res) => {
  let linkAvatar;
  if (!req.file) {
    linkAvatar = req.body.avatar;
  } else {
    linkAvatar = `http://toanluc.online/avatar/${req.file.filename}`;
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM users WHERE _id = @_id`);
    let user = result.recordset[0];
    //console.log(user.email);
    // console.log(req.file)
    if (user) {
      if (req.body.username) user.username = req.body.username;
      if (req.body.name) user.name = req.body.name;
      if (req.body.password) {
        var password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
      }
      if (req.body.role) user.role = req.body.role;
      if (req.body.updatedAt) user.updatedAt = req.body.updatedAt;
      if (req.body.ghichu) user.updatedAt = req.body.ghichu;
      await pool
        .request()
        .input("_id", req.params._id)
        .input("username", user.username)
        .input("name", user.name)
        .input("password", user.password)
        .input("role", user.role)
        .input("updatedAt", req.body.updatedAt)
        .input("avatar", linkAvatar)
        .input("ghichu", req.body.ghichu)
        .query(
          `UPDATE users SET
              username = @username,
              name = @name,
              password = @password, 
              role = @role,              
              updatedAt = @updatedAt,
              avatar = @avatar,
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

/* Lấy 1 user auth */
router.get("/auth/user", verifyToken, async (req, res) => {
  const _id = req.decoded._id;
  //console.log(req.decoded._id)
  //console.log(req.decoded.email)
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM users WHERE _id = ${_id}`);
    const user = result.recordset[0];
    if (!user) {
      res.status(403).json({
        success: false,
        message: "Authenticate failed, not found user",
      });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Login user auth */
router.post("/auth/login", async (req, res, next) => {
  const username = req.body.username;
  // console.log(req.body.email)
  const password = req.body.password;
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("username", username)
      .query(`SELECT * FROM users WHERE username = @username`);
    const user = result.recordset[0];
    //console.log(user)
    if (!user) {
      res.json({
        success: 1,
        message: "Authenticate failed, không có user",
      });
    } else {
      if (user.status == 0) {
        res.json({
          success: 2,
          message: "Authenticate failed, đã bị khóa",
        });
      }
      const match = await bcrypt.compare(password, user.password);
      // console.log(match)
      if (match) {
        let token = jwt.sign(user, process.env.SECRET);
        res.json({ data: user, token, success: 3, message: "login success" });
      } else {
        res.json({
          success: 4,
          message: "Authenticate failed, wrong password",
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Tạo user auth kèm token */
router.post("/account", upload.single("avatar"), async (req, res) => {
  var password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, 10);

  let linkAvatar;
  const file = req.file;
  if (!file) {
    linkAvatar = req.body.avatar;
  } else {
    // Đổi đường dẫn khi deploy lên máy chủ
    linkAvatar = `http://toanluc.online/avatar/${req.file.filename}`;
  }
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("username", req.body.username)
      .input("name", req.body.name)
      .input("password", encryptedPassword)
      .input("role", req.body.role)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("avatar", linkAvatar)
      .input("ghichu", req.body.ghichu)
      .input("maxuong", req.body.maxuong).query(`
                INSERT INTO users (username, name, password, role, createdAt, createdBy, avatar, ghichu, maxuong) 
                VALUES (@username, @name, @password, @role, @createdAt, @createdBy, @avatar, @ghichu, @maxuong);
            `);
    const user = req.body;
    let token = jwt.sign({ user }, process.env.SECRET);
    res.json({ user, token, message: "Create user success!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Cập nhật user auth */
router.patch("/auth/user", verifyToken, async (req, res) => {
  const _id = req.decoded._id;
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM users WHERE _id = ${_id}`);
    let user = result.recordset[0];
    //console.log(user.email);
    if (user) {
      if (req.body.email) user.email = req.body.email;
      if (req.body.username) user.username = req.body.username;
      if (req.body.name) user.name = req.body.name;
      if (req.body.password) {
        var password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
      }
      await pool
        .request()
        .input("_id", _id)
        .input("email", user.email)
        .input("username", user.username)
        .input("name", user.name)
        .input("password", user.password)
        .input("updatedAt", req.body.updatedAt)
        .query(
          `UPDATE users SET 
              email = @email, 
              password = @password, 
              username = @username, 
              name = @name,
              updatedAt = @updatedAt
          WHERE _id = ${_id};`
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

/* Xóa dữ liệu */
router.delete("/:_id", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("_id", req.params._id)
      .query(`SELECT * FROM users WHERE _id = @_id`);
    let user = result.recordset.length ? result.recordset[0] : null;
    if (user) {
      await pool
        .request()
        .input("_id", req.params._id)
        .query(`DELETE FROM users WHERE _id = @_id;`);
      res.json(user);
    } else {
      res.status(404).json({
        message: "Không tìm thấy user này",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
