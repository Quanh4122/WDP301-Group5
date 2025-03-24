const userRouter = require("./User");
const blogRouter = require("./Blog");
const carRouter = require("./Car");
const requestRouter = require("./Request");
const dashboardRouter = require("./Dashboard");
const uploadRouter = require("./UploadAvatar");
const billRouter = require("./Bill");


function route(app) {
  app.use("/", userRouter);
  app.use("/", blogRouter);
  app.use("/car", carRouter);
  app.use("/request", requestRouter);
  app.use("/", dashboardRouter);
  app.use("/", uploadRouter);
  app.use("/", billRouter);
}

module.exports = route;