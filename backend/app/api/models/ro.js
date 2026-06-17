const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const RoSchema = new Schema({
  nik: {
    type: String,
    trim: true,
    required: true,
  },
  norm: {
    type: String,
    trim: true,
  },
  nama: {
    type: String,
    trim: true,
    required: true,
  },
  tglLahir: {
    type: String,
    trim: true,
    required: true,
  },
  jenisKelamin: {
    type: String,
    trim: true,
    required: true,
  },
  noTelp: {
    type: String,
    trim: true,
    required: true,
  },
  poli: {
    type: String,
    trim: true,
    required: true,
  },
  tglKunjungan: {
    type: String,
    trim: true,
    required: true,
  },
  kategori: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: Number,
    trim: true,
    default: 0,
  },
  createdAt: {
    type: String,
    trim: true,
  },
  updatedAt: {
    type: String,
    trim: true,
  },
});
module.exports = mongoose.model("RegistrasiOnline", RoSchema);
