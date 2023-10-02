const express = require("express");
const router = express.Router();
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const onlineUsers = new Set();

io.on("connection", (socket) => {
  // Khi người dùng kết nối
  console.log("Người dùng đã kết nối");

  // Thêm người dùng vào danh sách trực tuyến
  onlineUsers.add(socket.id);

  // Gửi danh sách người dùng trực tuyến cho tất cả các kết nối
  io.emit("onlineUsers", Array.from(onlineUsers));

  // Khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    // Xóa người dùng ra khỏi danh sách trực tuyến
    onlineUsers.delete(socket.id);

    // Gửi danh sách người dùng trực tuyến đã cập nhật cho tất cả các kết nối
    io.emit("onlineUsers", Array.from(onlineUsers));

    console.log("Người dùng đã ngắt kết nối");
  });
});

module.exports = router;
