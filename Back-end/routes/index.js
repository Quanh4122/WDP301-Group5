const userRouter = require("./User");
const blogRouter = require("./Blog");
const carRouter = require("./Car");
const driverRouter = require("./Driver");
const requestRouter = require("./Request");
const dashboardRouter = require("./Dashboard");
const billRouter = require("./Bill");

function route(app) {
  app.use("/", userRouter);
  app.use("/", blogRouter);
  app.use("/car", carRouter);
  app.use("/", driverRouter);
  app.use("/request", requestRouter);
  app.use("/", dashboardRouter);
  app.use("/", billRouter);
}

module.exports = route;
