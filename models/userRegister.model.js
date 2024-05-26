const mongoose = require("mongoose");

const userRegisterSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserRegister = mongoose.model("UserRegister", userRegisterSchema);

module.exports = UserRegister;
