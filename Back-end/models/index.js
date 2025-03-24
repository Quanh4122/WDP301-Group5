const mongoose = require("mongoose");
const { Bill } = require("./bill.model");
const { Blog } = require("./blog.model");
const { Car } = require("./car.model");
const { CarType } = require("./cartype.model");
const { Request } = require("./request.model");
const { Role } = require("./role.model");
const { User } = require("./user.model");
const {Driver} = require("./driverapplication.model");



const db = {};
db.bill = Bill;
db.blog = Blog;
db.car = Car;
db.cartype = CarType;
db.request = Request;
db.role = Role;
db.user = User;
db.driver = Driver



db.connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME })
    .then(console.log("Connect to mongoDB"))
    .catch((err) => {
      console.log("Connect fail : " + err);
    });
};

module.exports = { db };
