const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    require: true 
  },
  driverID: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver", 
    require: true 
  },
  startDate: { 
    type: Date, 
    require: true 
  },
  endDate: { 
    type: Date, 
    require: true 
  },
  requestStatus: { 
    type: String, 
    require: true 
  },
});

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
