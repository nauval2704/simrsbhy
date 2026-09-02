const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PoliGigiSchema = new Schema({
    noCheckin: {
      type: String,
      trim: true,
      default: null,
    },
    noMr: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
  canvasImage: {
    type: String,
    default: null,
  },
  tglInput: {
    type: String,
    trim: true,
    default: null,
  },
}, { strict: false });

module.exports = mongoose.model("PoliGigi", PoliGigiSchema);
