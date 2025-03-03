const userRouter = require("./User");
const blogRouter = require("./Blog");
const carRouter = require("./Car");
const driverRouter = require("./Driver");
const requestRouter = require("./Request");

function route(app) {
  app.use("/", userRouter);
  app.use("/", blogRouter);
  app.use("/car", carRouter);
  app.use("/", driverRouter);
  app.use("/request", requestRouter);
}

module.exports = route;
