const express = require("express");
const server = express();

// add header to fix bug cors

server.use((req, res, next) => {
  // Website wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Origin", "*");

  // Request method wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  // Request header wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-Type"
  );
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  //Set to true if need the website to include cookies in the request sent
  //to the API ( in case use session)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // Passto next layer of middleware

  // res.setHeader("Access-Control-Max-Age", "1800");

  next();
});

server.use(express.json());

const {
  ArticleController,
  UserController,
  AuthController,
  Notification,
} = require("./controller");
require("dotenv").config();
const { db } = require("./models");

// Auth API

server.post("/auth/sign-in", AuthController.signin);
server.post("/auth/sign-up", AuthController.SignUp);

// userAPI

server.get("/api/teacher/searchbyname", UserController.SearchTeacherByName);
server.get("/api/user", UserController.getUserById);

// Article API
server.get("/api/articles", ArticleController.GetAllByUserKey);

server.get("/api/articles/follows", ArticleController.GetAllFollowsByUserKey);

server.put("/api/articles/follows", ArticleController.putFollows);

server.post("/api/articles", ArticleController.CreateArticle);

server.delete("/api/articles", ArticleController.DeleteCompose);

server.get("/api/articles/detail", ArticleController.GetArticleAndReplyDetal);

server.put("/api/articles/reply", ArticleController.ReplyCompose);

server.put("/api/articles/delete-reply", ArticleController.DeleteReply);

server.put("/api/articles/like-or-dislike", ArticleController.LikeOrDislike);

// Notification api
server.get("/api/notifications", Notification.GetAllNotifiCationByUserId);

server.listen(process.env.PORT, "localhost", () => {
  console.log("Server is running at : " + process.env.PORT);
  db.connectDB();
});
