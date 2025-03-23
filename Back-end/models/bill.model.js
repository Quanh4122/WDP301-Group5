const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
  },
  billStatus: {
    type: Boolean,
    required: true,
  },
  vatFee: {
    type: Number,
    required: false,
  },
  totalCarFee: {
    type: Number,
    required: false,
  },
  depositFee: {
    type: Number,
    required: false,
  },
  realTimeDrop: {
    type: Date,
    required: false,
  },
  realLocationDrop: {
    type: String,
    required: false,
  },
  realImage: {
    type: String,
    required: false,
  },
  penaltyFee: {
    type: Number,
    required: false,
  },
});

const BillModel = mongoose.model("Bill", BillSchema);

module.exports = BillModel;
