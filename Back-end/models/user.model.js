const mongoose = require("mongoose");
const RoleModel = require("./role.model");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    require: true,
  },
  otp_expiry_time: {
    type: Date,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.role) {
    try {
      let defaultRole = await RoleModel.findOne({ roleName: "user" });
      if (!defaultRole) {
        defaultRole = new RoleModel({ roleName: "user" });
        await defaultRole.save();
      }
      this.role = defaultRole._id;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
