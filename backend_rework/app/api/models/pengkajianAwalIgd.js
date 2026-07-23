const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PengkajianAwalIgdSchema = new Schema({
  noCheckin: { type: String, default: null },
  noMr: { type: String, default: null },
  namaPasien: { type: String, default: null },
  dpjp: { type: String, default: null },
  
  // New input fields for Pengkajian Awal IGD
  keluhanUtama: { type: String, default: null },
  riwayatPenyakitSekarang: { type: String, default: null },
  riwayatPenyakitDahulu: { type: String, default: null },
  riwayatAlergi: { type: String, default: null },
  
  // Vital Signs
  td: { type: String, default: null },
  nadi: { type: String, default: null },
  suhu: { type: String, default: null },
  rr: { type: String, default: null },
  spo2: { type: String, default: null },
  
  // Pemeriksaan Fisik ABC
  airway: { type: String, default: null },
  breathing: { type: String, default: null },
  circulation: { type: String, default: null },
  disability: { type: String, default: null },
  
  // GCS
  gcsE: { type: Number, default: null },
  gcsV: { type: Number, default: null },
  gcsM: { type: Number, default: null },
  
  // Skrining
  skriningNyeri: { type: String, default: null },
  skriningJatuh: { type: String, default: null },
  
  // Diagnosa & Rencana
  diagnosaKeperawatan: { type: String, default: null },
  rencanaTindakan: { type: String, default: null },

  // Original fields
  canvasImage: { type: String, default: null },
  formData: { type: Object, default: {} },
  tglInput: { type: String, default: null },
  user: { type: String, default: null },
}, { strict: false });

module.exports = mongoose.model("PengkajianAwalIgd", PengkajianAwalIgdSchema);
