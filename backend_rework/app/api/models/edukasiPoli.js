const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const EdukasiPoliSchema = new Schema({
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
  canvasImage: {
    type: String,
    default: null,
  },
  tglInput: {
    type: String,
    trim: true,
    default: null,
  },
});

module.exports = mongoose.model("EdukasiPoli", EdukasiPoliSchema);
