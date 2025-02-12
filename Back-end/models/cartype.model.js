const mongoose = require("mongoose");

const CarTypeSchema = new mongoose.Schema({
  numberOfSeats: { 
    type: Number, 
    require: true 
  },
  carVersion: { 
    type: Number, 
    require: true 
  },
  bunkBed: { 
    type: Boolean, 
    require: true 
  },
});

const CarTypeModel = mongoose.model("CarType", CarTypeSchema);

module.exports = CarTypeModel;
