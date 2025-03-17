const mongoose = require("mongoose");
const RoleModel = require("./role.model");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  fullName: { type: String },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  avatar: { type: String },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
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
