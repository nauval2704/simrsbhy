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
  namaPasien: {
    type: String,
    default: null,
  },
  dpjp: {
    type: String,
    default: null,
  },
  entries: {
    type: Array,
    default: [],
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

module.exports = mongoose.model("EdukasiPoli", EdukasiPoliSchema);
