const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  emailRequest: { type: String, required: false },
  driver: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Driver",
  },
  car: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Car",
    required: true,
  },
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  requestStatus: {
    type: String,
    required: true,
  },
  isRequestDriver: {
    type: Boolean,
    required: true,
  },
  timeCreated: {
    type: Date,
    default: Date.now,
  },
  pickUpLocation: {
    type: String,
    required: false,
  },
  dropLocation: {
    type: String,
    required: false,
  },
});

RequestSchema.index({ nextCheckTime: 1 });

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
