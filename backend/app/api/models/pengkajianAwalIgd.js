const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PengkajianAwalIgdSchema = new Schema({
  noCheckin: { type: String, default: null },
  noMr: { type: String, default: null },
  namaPasien: { type: String, default: null },
  dpjp: { type: String, default: null },
  canvasImage: { type: String, default: null },
  tglInput: { type: String, default: null },
  user: { type: String, default: null },
}, { strict: false });

module.exports = mongoose.model("PengkajianAwalIgd", PengkajianAwalIgdSchema);
