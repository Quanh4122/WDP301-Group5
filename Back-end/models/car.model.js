const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  carName: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  images: {
    type: [String],
    require: true,
  },
  carStatus: {
    type: Boolean,
    require: true,
  },
  licensePlateNumber: {
    type: String,
    require: true,
  },
  price: {
    type: [Number],
    require: true,
  },
  carVersion: {
    type: Number,
    require: true,
  },
  carType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarType",
    require: true,
  },
  numberOfSeat: {
    type: Number,
    require: true,
  },
});

const CarModel = mongoose.model("Car", CarSchema);

module.exports = CarModel;
