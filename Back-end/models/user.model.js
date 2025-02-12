const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    require: true 
  },
  password: { 
    type: String, 
    require: true 
  },
  fullName: { 
    type: String, 
    require: true 
  },
  email: { 
    type: String, 
    require: true 
  },
  avatar: { 
    type: String, 
    require: true 
  },
  phoneNumber: { 
    type: String, 
    require: true 
  },
  oldPassword: { 
    type: String, 
    require: true 
  },
  roleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Role",
    require: true 
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
