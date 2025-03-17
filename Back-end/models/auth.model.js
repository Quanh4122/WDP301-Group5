const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  password: { type: String},
  passwordConfirm: { type: String },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  otp: { type: String},
  otp_expiry_time: { type: Date },
});

const AuthModel = mongoose.model("Auth", AuthSchema);

module.exports = AuthModel;