const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const RujukanSchema = new Schema({
  AsalRujukanKode: {
    type: String,
    required: false,
    default: null,
  },
  AsalRujukanNama: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  diagnosaKode: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  diagnosaNama: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  noRujukan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaAsuransi: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaHakKelas: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaJnsPeserta: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaKelamin: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaNama: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaNoKartu: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaNoMr: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  pesertaTglLahir: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  poliTujuanKode: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  poliTujuanNama: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  tglBerlakuKunjungan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  tglRencanaKunjungan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  tglRujukan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  tujuanRujukanKode: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  tujuanRujukanNama: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  jenisPelayanan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  catatan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  tipeRujukan: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  user: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
});
module.exports = mongoose.model("Rujukan", RujukanSchema);
