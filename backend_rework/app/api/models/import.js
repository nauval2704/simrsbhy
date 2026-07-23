const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const ImportSchema = new Schema({
  noFaktur: {
    type: String,
    trim: true,
    default: null,
  },
  tglFaktur: {
    type: String,
    default: null,
  },
  distributor: {
    type: Schema.Types.ObjectId,
    ref: "Distributor",
  },
  kategori: {
    type: String,
    default: null,
  },
  batch: {
    type: String,
    default: null,
  },
  nama: {
    type: String,
    default: null,
  },
  satuan: {
    type: String,
    default: null,
  },
  jenis: {
    type: String,
    default: null,
  },
  jumlah: {
    type: Number,
    default: null,
  },
  hargaBeli: {
    type: Number,
    trim: true,
    default: null,
  },
  hargaSatuan: {
    type: Number,
    trim: true,
    default: null,
  },
  hargaJualBPJS: {
    type: Number,
    required: true,
    default: null,
  },
  hargaJualYANKES: {
    type: Number,
    required: true,
    default: null,
  },
  createdAt: {
    type: String,
    required: true,
    default: null,
  },
  updatedAt: {
    type: String,
    default: null,
  },
});
module.exports = mongoose.model("Import", ImportSchema);
