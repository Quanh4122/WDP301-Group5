const mongoose = require("mongoose");
const { Article } = require("./article.model");

const db = {};
db.article = Article;

db.connectDB = () => {
  mongoose
    .connect(process.env.URL, { dbName: process.env.DBNAME })
    .then(console.log("Connect to mongoDB"))
    .catch((err) => {
      console.log("Connect fail : " + err);
    });
};

module.exports = { db };
