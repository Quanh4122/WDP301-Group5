const userRouter = require("./User");
const blogRouter = require("./Blog");
const carRouter = require("./Car");
const driverRouter = require("./Driver");
const requestRouter = require("./Request");
const dashboardRouter = require("./Dashboard");
const uploadRouter = require("./UploadAvtar");

function route(app) {
  app.use("/", userRouter);
  app.use("/", blogRouter);
  app.use("/car", carRouter);
  app.use("/", driverRouter);
  app.use("/request", requestRouter);
  app.use("/", dashboardRouter);
  app.use("/", uploadRouter);
}

module.exports = route;
