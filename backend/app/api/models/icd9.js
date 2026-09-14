const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const Icd9Schema = new Schema({
  kode: {
    type: String,
    trim: true,
    required: true,
  },
  deskripsi: {
    type: String,
    trim: true,
    required: true,
  },
});
module.exports = mongoose.model("Icd9", Icd9Schema);
