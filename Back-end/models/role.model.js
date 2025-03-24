const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    require: true,
    enum: ["User", "Admin", "Driver"],
  },
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = RoleModel;
