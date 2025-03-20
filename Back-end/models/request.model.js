const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  emailRequest: { type: String, required: true },
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
    type: Date,
    default: Date.now,
  },
  pickUpLocation: {
    type: String,
    require: false,
  },
  pickUpLocation: {
    type: String,
    require: false,
  },
  dropLocation: {
    type: String,
    require: false,
  },
  nextCheckTime: {
    type: Date,
    default: null,
  },
});

RequestSchema.index({ nextCheckTime: 1 });

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
