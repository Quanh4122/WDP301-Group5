const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { 
    type: String,
    require: true 
  },
  age: { 
    type: Number, 
    require: true 
  },
  image: { 
    type: String, 
    require: true 
  },
  driverLicenseVerifyNumber: {
    type: String,
    require: true,
  },
  DoB:{
    type: Date,
    require: true,
  },
  licenseStatus: {
    type: Boolean,
    require: true,
  },
  driverStatus: {
    type: Boolean,
    require: true,
  },
  licenseType: {
    type: String,
    require: true,
  }
});

const DriverModel = mongoose.model("Driver", DriverSchema);

module.exports = DriverModel;
