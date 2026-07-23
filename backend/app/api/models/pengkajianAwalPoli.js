const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PengkajianAwalPoliSchema = new Schema({
  noCheckin: { type: String, default: null },
  noMr: { type: String, default: null },
  namaPasien: { type: String, default: null },
  dpjp: { type: String, default: null },
  formData: { type: Object, default: {} },
  canvasImage: { type: String, default: null },
  tglInput: { type: String, default: null },
  user: { type: String, default: null },
}, { strict: false });

module.exports = mongoose.model("PengkajianAwalPoli", PengkajianAwalPoliSchema);
