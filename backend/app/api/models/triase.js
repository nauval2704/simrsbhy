const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TriaseSchema = new Schema({
  noCheckin: {
    type: String,
    required: true,
    unique: true,
  },
  noMr: {
    type: String,
    trim: true,
    default: null,
  },
  td: {
    type: String,
    trim: true,
    default: null,
  },
  suhu: {
    type: String,
    trim: true,
    default: null,
  },
  hr: {
    type: String,
    trim: true,
    default: null,
  },
  rr: {
    type: String,
    trim: true,
    default: null,
  },
  spo2: {
    type: String,
    trim: true,
    default: null,
  },
  gcsE: {
    type: Schema.Types.Mixed,
    default: null,
  },
  gcsV: {
    type: Schema.Types.Mixed,
    default: null,
  },
  gcsM: {
    type: Schema.Types.Mixed,
    default: null,
  },
  triageLevel: {
    type: String,
    trim: true,
    default: null,
  },
  triageColor: {
    type: String,
    trim: true,
    default: null,
  },
  pukulPemeriksaan: {
    type: String,
    trim: true,
    default: null,
  },
  symptoms: {
    type: [String],
    default: [],
  },
  namaDokter: {
    type: String,
    default: null,
  },
  namaPerawat: {
    type: String,
    default: null,
  },
  situasiBerbahaya: {
    type: String,
    default: null,
  },
  doaDetail: {
    type: String,
    default: null,
  },
  konsul: {
    type: String,
    default: null,
  },
  satusehatSynced: {
    type: Boolean,
    default: false,
  },
  satusehatIds: {
    type: [String],
    default: [],
  },
  user: {
    type: String,
    trim: true,
    default: null,
  },
  tglInput: {
    type: String,
    trim: true,
    default: null,
  },
  canvasImage: {
    type: String,
    default: null,
  },
  canvasImagePerawat: {
    type: String,
    default: null,
  },
}, { strict: false });

module.exports = mongoose.model("Triase", TriaseSchema);
