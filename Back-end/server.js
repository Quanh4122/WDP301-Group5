const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./routes");
const bodyParser = require("body-parser");
const PORT = process.env.URL || 3000;
const CLIENT_URL = process.env.CLIENT_PORT;
const { UserController } = require("./controllers");
const WebSocket = require("ws");
const RequestModel = require("./models/request.model");
const http = require("http");

require("dotenv").config();
const { db } = require("./models");
db.connectDB();

server.use(express.json());

server.use(
  cors({
    origin: [CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use("/images", express.static("public/images"));

// Tạo server HTTP để gắn WebSocket
const httpServer = http.createServer(server);
const wss = new WebSocket.Server({ server: httpServer });

// WebSocket: Quản lý kết nối
wss.on("connection", (ws) => {
  console.log("Client đã kết nối qua WebSocket");
  ws.send(JSON.stringify({ message: "Kết nối WebSocket thành công!" }));

  ws.on("close", () => console.log("Client đã ngắt kết nối"));
  ws.on("error", (error) => console.error("Lỗi WebSocket:", error));
});

// Hàm gửi dữ liệu đến tất cả client
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

setInterval(async () => {
  try {
    const currentTime = new Date();
    const request = await RequestModel.find({
      requestStatus: "2",
    });
    console.log(request);
  } catch (error) {}
}, 600000000);

route(server);

server.listen(process.env.PORT, "localhost", () => {
  console.log("Server is running at : " + process.env.PORT);
});
