const mongoose = require("mongoose");
const { type } = require("os");

const schemaArticle = new mongoose.Schema({
  id: { type: String, require: true },
  subject: { type: String, require: false },
  content: { type: String, require: true },
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", require: true },
  role: { type: String, require: true },
  dateCreated: { type: String, require: true },
  follows: [
    { type: mongoose.SchemaTypes.ObjectId, ref: "User", require: true },
  ],
  reply: {
    type: [
      {
        _id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          require: false,
        },
        content: { type: String, require: false },
        dateCreated: { type: String, require: false },
      },
    ],
    require: false,
  },
  likes: {
    type: [
      {
        userId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          require: false,
        },
        isLike: { type: Boolean, require: false },
      },
    ],
    require: false,
  },
});

const Article = mongoose.model("Article", schemaArticle, "Article");

module.exports = { Article };
