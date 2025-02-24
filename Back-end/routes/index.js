const userRouter = require('./User');
const blogRouter = require('./Blog');


function route(app) {
    app.use('/', userRouter);
    app.use('/', blogRouter);
const userRouter = require("./User");
const carRouter = require("./Car");

function route(app) {
  app.use("/", userRouter);
  app.use("/car", carRouter);
}

module.exports = route;
