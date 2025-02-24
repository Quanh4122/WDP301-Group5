const mongoose = require("mongoose");

const CarTypeSchema = new mongoose.Schema({
  bunkBed: {
    type: Boolean,
    require: true,
  },
  flue: {
    type: Boolean,
    require: true,
  },
  transmissionType: {
    type: Boolean,
    require: true,
  },
});

const CarTypeModel = mongoose.model("CarType", CarTypeSchema);

module.exports = CarTypeModel;
