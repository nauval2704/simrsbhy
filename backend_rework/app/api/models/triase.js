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
    type: Number,
    default: null,
  },
  gcsV: {
    type: Number,
    default: null,
  },
  gcsM: {
    type: Number,
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
  symptoms: {
    type: [String],
    default: [],
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
  namaDokter: {
    type: String,
    trim: true,
    default: null,
  },
  namaPerawat: {
    type: String,
    trim: true,
    default: null,
  },
  situasiBerbahaya: {
    type: String,
    trim: true,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Triase", TriaseSchema);
