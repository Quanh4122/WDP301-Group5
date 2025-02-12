const express = require("express");
const server = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const PORT = process.env.URL || 3000;
const CLIENT_URL = process.env.CLIENT_PORT;
const { UserController } = require("./controllers");
require("dotenv").config();
const { db } = require("./models");

server.use(express.json());

server.use(cors({
  origin: [CLIENT_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));

server.get("/auth/sign-in", UserController.getAllUser);

server.listen(process.env.PORT, "localhost", () => {
  console.log("Server is running at : " + process.env.PORT);
  db.connectDB();
});
