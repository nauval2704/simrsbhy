const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const RincianSchema = new Schema({
  noCheckin: {
    type: String,
    default: null,
  },
  noTarif: {
    type: Number,
    default: null,
  },
  qty: {
    type: Number,
    default: null,
  },
  pelayanan: {
    type: String,
    default: null,
  },
  user: {
    type: String,
    default: null,
  },
  tglInput: {
    type: String,
    required: true,
    default: null,
  },
});
module.exports = mongoose.model("Rincian", RincianSchema);
