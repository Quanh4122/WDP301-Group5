const userRouter = require('./User');


function route(app) {
    app.use('/', userRouter);
}

module.exports = route;
