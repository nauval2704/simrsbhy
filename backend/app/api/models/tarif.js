const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const TarifSchema = new Schema({
  noTarif: {
    type: Number,
    trim: true,
    default: null,
  },
  nama: {
    type: String,
    default: null,
  },
  harga: {
    type: Number,
    default: null,
  },
  pelayanan: {
    type: String,
    default: null,
  },
  komposisi: {
    type: String,
    default: null,
  },
  stock: {
    type: Number,
    default: null,
  },
  user: {
    type: String,
    trim: true,
    default: null,
  },
  tglInput: {
    type: String,
    required: true,
    default: null,
  },
});
module.exports = mongoose.model("Tarif", TarifSchema);
