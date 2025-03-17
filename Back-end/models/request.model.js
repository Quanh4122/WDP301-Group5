const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  driver: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Driver",
  },
  car: {
    type: [mongoose.Schema.Types.ObjectId],
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
  timeCreated: { 
    type: Date, default: Date.now
  },
});

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
