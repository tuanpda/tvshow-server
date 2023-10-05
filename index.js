const bodyParse = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
dotenv.config();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.get("/", (req, res) => {
  res.send("<h1>🤖 TVSHOW - THACHHA</h1>");
});

app.use("/api/users", require("./api/users"));
app.use("/api/chuongtrinhct", require("./api/chuongtrinhct"));

app.listen(process.env.PORT, () => {
  console.log(`Server started running on ${process.env.PORT}`);
});
