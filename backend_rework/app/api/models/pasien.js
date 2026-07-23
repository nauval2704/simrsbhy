const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const PasienSchema = new Schema({
  norm: {
    type: String,
    trim: true,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  nik: {
    type: String,
    trim: true,
    default: null,
  },
  nobpjs: {
    type: String,
    trim: true,
    default: null,
  },
  notelp: {
    type: String,
    trim: true,
    default: null,
  },
  tempatlahir: {
    type: String,
    trim: true,
    default: null,
  },
  tgllahir: {
    type: String,
    trim: true,
    default: null,
  },
  sex: {
    type: String,
    trim: true,
    default: null,
  },
  agama: {
    type: String,
    trim: true,
    default: null,
  },
  alamat: {
    type: String,
    trim: true,
    default: null,
  },
  propinsi: {
    type: String,
    trim: true,
    default: null,
  },
  kabupaten: {
    type: String,
    trim: true,
    default: null,
  },
  kecamatan: {
    type: String,
    trim: true,
    default: null,
  },
  prb: {
    type: String,
    trim: true,
    default: null,
  },
  hakKelas: {
    type: String,
    trim: true,
    default: null,
  },
  user: {
    type: String,
    trim: true,
    default: null,
  },
  tglinput: {
    type: String,
    trim: true,
    required: true,
    default: null,
  },
});
module.exports = mongoose.model("Pasien", PasienSchema);
