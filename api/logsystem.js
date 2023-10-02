const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");

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

module.exports = router;
