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
  dateUpdated: { type: Date },
  images: [{ type: String }],
});

const BlogModel = mongoose.model("Blog", BlogSchema);

module.exports = BlogModel;
