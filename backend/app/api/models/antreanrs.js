const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const AntreanRsSchema = new Schema({
  loket: {
    type: String,
    trim: true,
    required: true,
  },
  kodeAntrean: {
    type: String,
    trim: true,
    required: true,
  },
  noAntrean: {
    type: Number,
    trim: true,
    required: true,
    default: 0,
  },
  reset: {
    type: Number,
    trim: true,
    required: true,
    default: 0,
  },
  tglInput: {
    type: String,
    trim: true,
    required: true,
  },
});
module.exports = mongoose.model("AntreanRs", AntreanRsSchema);