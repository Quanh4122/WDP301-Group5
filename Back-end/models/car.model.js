const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  carName: { 
    type: String, 
    require: true 
  },
  color: { 
    type: String, 
    require: true 
  },
  images: { 
    type: [String], 
    require: true 
  },
  carStatus: { 
    type: Boolean, 
    require: true 
  },
  licensePlateNumber: { 
    type: String, 
    require: true 
  },
});

const CarModel = mongoose.model("Car", CarSchema);

module.exports = CarModel;
