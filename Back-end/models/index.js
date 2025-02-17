const mongoose = require("mongoose");
const { Bill } = require("./bill.model");
const { Blog } = require("./blog.model");
const { Car } = require("./car.model");
const { CarType } = require("./cartype.model");
const { Driver } = require("./driver.model");
const { Request } = require("./request.model");
const { Role } = require("./role.model");
const { User } = require("./user.model");


const db = {};
db.bill = Bill;
db.blog = Blog;
db.car = Car;
db.cartype = CarType;
db.driver = Driver;
db.request = Request;
db.role = Role;
db.user = User;



db.connectDB = () => {
  mongoose
    .connect(process.env.URL, { dbName: process.env.DBNAME })
    .then(console.log("Connect to mongoDB"))
    .catch((err) => {
      console.log("Connect fail : " + err);
    });
};

module.exports = { db };
