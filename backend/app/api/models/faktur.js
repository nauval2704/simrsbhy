const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const FakturSchema = new Schema({
  noFaktur: {
    type: String,
    trim: true,
    default: null,
  },
  noTarif: {
    type: Number,
    trim: true,
    default: null,
  },
  stock: {
    type: Number,
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
    required: true,
    default: null,
  },
});
module.exports = mongoose.model("Faktur", FakturSchema);
