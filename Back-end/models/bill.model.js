const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    require: true,
  },
  billStatus: {
    type: Boolean,
    require: true,
  },
});

const BillModel = mongoose.model("Bill", BillSchema);

module.exports = BillModel;
