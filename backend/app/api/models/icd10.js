const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const Icd10Schema = new Schema({
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
module.exports = mongoose.model("icd", Icd10Schema, "icd");
