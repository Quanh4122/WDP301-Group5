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
  vatFeed: {
    type: Number,
    required: true,
  },
  totalCarFee: {
    type: Number,
    required: true,
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
});

const BillModel = mongoose.model("Bill", BillSchema);

module.exports = BillModel;
