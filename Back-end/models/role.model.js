const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  roleName: { 
    type: String, 
    require: true 
  },
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = RoleModel;
