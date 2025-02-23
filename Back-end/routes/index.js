const userRouter = require('./User');
const blogRouter = require('./Blog');


function route(app) {
    app.use('/', userRouter);
    app.use('/', blogRouter);
}

module.exports = route;
