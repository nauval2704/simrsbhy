const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const RuanganSchema = new Schema({
  kodeKelas: {
    type: String,
    trim: true,
    default: '0',
  },
  koderuang: {
    type: String,
    trim: true,
    default: '0',
  },
  namaruang: {
    type: String,
    trim: true,
    default: '0',
  },
  kapasitas: {
    type: String,
    trim: true,
    default: '0',
  },
  tersedia: {
    type: String,
    trim: true,
    default: '0',
  },
  tersediapria: {
    type: String,
    trim: true,
    default: '0',
  },
  tersediawanita: {
    type: String,
    trim: true,
    default: '0',
  },
  tersediapriawanita: {
    type: String,
    trim: true,
    default: '0',
  },
  kode_tt: {
    type: String,
    trim: true,
    default: '0',
  },
  id_t_tt: {
    type: String,
    trim: true,
    default: '0',
  },
  user: {
    type: String,
    trim: true,
    default: null,
  },
  tglinput: {
    type: String,
    trim: true,
    default: null,
  },
});
module.exports = mongoose.model("Ruangan", RuanganSchema);
