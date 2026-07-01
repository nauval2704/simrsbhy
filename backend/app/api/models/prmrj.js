const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PrmrjSchema = new Schema({
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

module.exports = mongoose.model("Prmrj", PrmrjSchema);
