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
const moment = require("moment-timezone");
const NotifyExtendBill = require("./Templates/Mail/notifyExtentionBill");
const mailService = require("./services/sendMail");
const dayjs = require("dayjs");

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

// Hàm cập nhật requestStatus
const updateRequestStatus = async (request) => {
  if (request.requestStatus == "2") {
    request.requestStatus = "3";
    await request.save();

    broadcast({
      event: "request-status-updated",
      data: {
        requestId: request._id,
        requestStatus: request.requestStatus,
        endDate: request.endDate,
      },
    });
    console.log(`Đã cập nhật trạng thái request ${request._id}`);
  }
};

const sendEmailRequestStatus3 = async (item) => {
  const now = dayjs();
  const threeHoursLater = now.add(3, "hour");
  const start = dayjs(item.startDate);
  const end = dayjs(item.endDate);
  if (end.isAfter(now) && end.isBefore(threeHoursLater)) {
    console.log(item);
    const startDate = start.format("HH:mm, DD/MM/YYYY");
    const endDate = end.format("HH:mm, DD/MM/YYYY");
    // Thêm phần update Item lên status 3 ( gần đến lúc trả xe)
    const detailRequestURL = `http://localhost:3000/app/request-in-expire?requestId=${item._id}`;
    const emailContent = await NotifyExtendBill(
      `${item.user.userName}`,
      startDate,
      endDate,
      item.pickUpLocation,
      detailRequestURL
    );
    await mailService.sendEmail({
      to: item.user.email,
      subject: "Thông báo yêu cầu đặt xe",
      html: emailContent,
    });
  }
};

const getListRequestStatus2AndSendMai = async () => {
  const request = await RequestModel.find({
    requestStatus: "2",
  })
    .populate("user", "userName fullName email phoneNumber address avatar")
    .populate(
      "car",
      "carName color licensePlateNumber price carVersion images numberOfSeat"
    );
  request.map((item) => sendEmailRequestStatus3(item));
  //console.log("Check status 2");
};

setInterval(async () => {
  try {
    getListRequestStatus2AndSendMai();
  } catch (error) {}
}, 6000000);

route(server);

server.listen(process.env.PORT, "localhost", () => {
  console.log("Server is running at : " + process.env.PORT);
});
