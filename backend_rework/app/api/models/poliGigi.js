const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PoliGigiSchema = new Schema(
  {
    noCheckin: {
      type: String,
      required: true,
      unique: true,
    },
    noMr: {
      type: String,
      trim: true,
      default: null,
    },
    formData: { type: Object, default: {} },
    entries: { type: Array, default: [] },
    canvasImage: {
      type: String,
      default: null,
    },
    tglInput: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { strict: false, timestamps: true }
);

module.exports = mongoose.model("PoliGigi", PoliGigiSchema);
