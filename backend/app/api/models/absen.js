var mongoose = require("mongoose");

var absenSchema = new mongoose.Schema({
  email: String,
  nama: String,
  absen: String,
  location: String,
  status: String,
  bagian: String,
  wfh: String,
  kendaraan: String,
  pekerjaan: String,
  kondisi: String,
  usia: String,
  hamil: String,
  menyusui: String,
  demam: String,
  batuk: String,
  pilek: String,
  tenggorokan: String,
  sesak: String,
  tglInput: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Absen", absenSchema);
