const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    require: true 
  },
  description: { 
    type: String, 
    require: true 
  },
  dateCreate: { 
    type: Date, 
    require: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    require: true 
  },
  image: { 
    type: String, 
    require: true 
  },
});

const BlogModel = mongoose.model("Blog", BlogSchema);

module.exports = BlogModel;
