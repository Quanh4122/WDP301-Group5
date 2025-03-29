const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./routes");
const bodyParser = require("body-parser");
const PORT = process.env.URL || 3000;
const CLIENT_URL = process.env.CLIENT_PORT;
const WebSocket = require("ws");
const RequestModel = require("./models/request.model");
const BillModel = require("./models/bill.model");
const http = require("http");
const moment = require("moment-timezone");
const NotifyExtendBill = require("./Templates/Mail/notifyExtentionBill");
const NotifyGetCar = require("./Templates/Mail/notifyGetCar");
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

const sendEmailRequestStatus3 = async (item) => {
  const now = dayjs();
  const start = dayjs(item.startDate);
  const end = dayjs(item.endDate);
  const mortGateFee = 3000000;
  // Kiểm tra nếu end nằm trong khoảng từ now đến 2 tiếng sau (hoursLater)
  if (now.isAfter(start.subtract(1, "hour")) && now.isBefore(start)) {
    console.log("check");
    const startDate = start.format("HH:mm, DD/MM/YYYY");
    const endDate = end.format("HH:mm, DD/MM/YYYY");

    await RequestModel.updateOne(
      {
        _id: item._id,
      },
      {
        requestStatus: "3",
      }
    );

    const bill = await BillModel.findOne({ request: item._id });
    if (bill) {
      const detailRequestURL = `http://localhost:3000/app/request-in-expire?requestId=${item._id}&billId=${bill._id}`;
      const emailContent = NotifyGetCar(
        `${item.user.userName}`,
        startDate,
        endDate,
        item.pickUpLocation,
        bill.totalCarFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        mortGateFee.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      );
      await mailService.sendEmail({
        to: item.user.email,
        subject: "Thông báo từ B-car",
        html: emailContent,
      });
    }
  }
};

const sendEmailRequestStatus6 = async (item) => {
  const now = dayjs();
  const start = dayjs(item.startDate);
  const end = dayjs(item.endDate);

  // Kiểm tra nếu end nằm trong khoảng từ now đến 2 tiếng sau (hoursLater)
  if (now.isAfter(end) && now.isBefore(end.add(1, "hour"))) {
    console.log("check2");
    const startDate = start.format("HH:mm, DD/MM/YYYY");
    const endDate = end.format("HH:mm, DD/MM/YYYY");

    await RequestModel.updateOne(
      {
        _id: item._id,
      },
      {
        requestStatus: "6",
      }
    );

    const bill = await BillModel.findOne({ request: item._id });
    if (bill) {
      const detailRequestURL = `http://localhost:3000/app/request-in-expire?requestId=${item._id}&billId=${bill._id}`;
      const emailContent = NotifyExtendBill(
        `${item.user.userName}`,
        startDate,
        endDate,
        item.pickUpLocation,
        item.dropLocation,
        detailRequestURL
      );
      await mailService.sendEmail({
        to: item.user.email,
        subject: "Thông báo từ B-Car",
        html: emailContent,
      });
    }
  }
};

const getListRequestStatus2AndSendMail = async () => {
  const request = await RequestModel.find({
    requestStatus: "2",
  })
    .populate("user", "userName fullName email phoneNumber address avatar")
    .populate(
      "car",
      "carName color licensePlateNumber price carVersion images numberOfSeat"
    );
  request.map((item) => sendEmailRequestStatus3(item));
};

const getListRequestStatus4AndSendMail = async () => {
  const request = await RequestModel.find({
    requestStatus: "4",
  })
    .populate("user", "userName fullName email phoneNumber address avatar")
    .populate(
      "car",
      "carName color licensePlateNumber price carVersion images numberOfSeat"
    );
  request.map((item) => sendEmailRequestStatus6(item));
};

setInterval(async () => {
  try {
    getListRequestStatus2AndSendMail();
    getListRequestStatus4AndSendMail();
  } catch (error) {}
}, 10000);

route(server);

server.listen(process.env.PORT, "localhost", () => {
  console.log("Server is running at : " + process.env.PORT);
});
