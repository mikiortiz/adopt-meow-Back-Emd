const mongoose = require("mongoose");
const { number } = require("yup");

const catSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    castrated: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    specialCare: {
      type: String,
      required: true,
    },
    vaccinations: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true, // Puedes establecerlo como requerido si todas las cuentas deben tener una imagen
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cat", catSchema);
