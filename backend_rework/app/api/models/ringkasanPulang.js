const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const RingkasanPulangSchema = new Schema({
  noCheckin: { type: String, default: null },
  noMr: { type: String, default: null },
  namaPasien: { type: String, default: null },
  dpjp: { type: String, default: null },
  canvasImage: { type: String, default: null },
  
  tglJamMasuk: { type: String, default: null },
  tglJamKeluar: { type: String, default: null },
  indikasiMasuk: { type: String, default: null },
  keluhanUtama: { type: String, default: null },
  pemeriksaanFisik: { type: String, default: null },
  pemeriksaanPenunjang: { type: String, default: null },
  diagnosisKerja: { type: String, default: null },
  diagnosisBanding: { type: String, default: null },
  tindakanTerapi: { type: String, default: null },
  edukasi: { type: String, default: null },
  
  tindakLanjut: { type: Object, default: {} },
  alasanTidakDirawat: { type: Object, default: {} },
  kondisiKeluar: { type: Object, default: {} },

  tglInput: { type: String, default: null },
  user: { type: String, default: null },
}, { strict: false });

module.exports = mongoose.model("RingkasanPulang", RingkasanPulangSchema);
