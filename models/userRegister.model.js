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
    userType: {
      type: String,
      enum: ["owner", "adopter"],
      required: true,
    },
    image: {
      type: String,
      required: true, // Puedes establecerlo como requerido si todas las cuentas deben tener una imagen
    },
  },
  { timestamps: true }
);

const UserRegister = mongoose.model("UserRegister", userRegisterSchema);

module.exports = UserRegister;
