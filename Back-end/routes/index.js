const userRouter = require('./User');
const blogRouter = require('./Blog');
const carRouter = require("./Car");


function route(app) {
    app.use('/', userRouter);
    app.use('/', blogRouter);
    app.use("/car", carRouter);

}

module.exports = route;
