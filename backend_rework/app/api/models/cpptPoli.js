const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CpptPoliSchema = new Schema(
  {
    noCheckin: { type: String, default: null },
    noMr: { type: String, default: null },
    formData: { type: Object, default: {} },
    entries: { type: Array, default: [] },
    canvasImage: { type: String, default: null },
    tglInput: { type: String, default: null },
    user: { type: String, default: null },
    poliNama: { type: String, default: null },
  },
  { strict: false, timestamps: true }
);

module.exports = mongoose.model("CpptPoli", CpptPoliSchema);
