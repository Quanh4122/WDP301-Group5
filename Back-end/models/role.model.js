const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  roleName: { 
    type: String, 
    require: true,
    enum: ['user', 'admin', 'driver']
  },
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = RoleModel;
