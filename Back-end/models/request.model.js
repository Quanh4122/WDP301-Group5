const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    require: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  requestStatus: {
    type: String,
    require: true,
  },
  isRequestDriver: {
    type: Boolean,
    require: true,
  },
});

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
