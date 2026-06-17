const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const NakesSchema = new Schema({
  nama: {
    type: String,
    trim: true,
    required: true,
  },
  ket: {
    type: String,
    trim: true,
    default: null,
  },
  sub: {
    type: String,
    trim: true,
    default: null,
  },
  bag: {
    type: String,
    trim: true,
    default: null,
  },
  kategori: {
    type: String,
    trim: true,
    default: null,
  },
  telp: {
    type: String,
    trim: true,
    default: null,
  },
  user: {
    type: String,
    trim: true,
    default: null,
  },
  tglInput: {
    type: String,
    trim: true,
    required: true,
    default: null,
  },
});
module.exports = mongoose.model("Nakes", NakesSchema);
