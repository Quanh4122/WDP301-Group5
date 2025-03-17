const mongoose = require("mongoose");

const DriverApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: null },
  appliedAt: { type: Date },
  approvedAt: { type: Date },
  licenseNumber: { type: String, required: true },
  experience: { type: String, required: true },
  driversLicensePhoto: { type: String, required: true },
});

const DriverApplicationModel = mongoose.model(
  "DriverApplication",
  DriverApplicationSchema
);

module.exports = DriverApplicationModel;