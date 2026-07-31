const mongoose = require('mongoose');

const TataTertibRanapSchema = new mongoose.Schema({
  noCheckin: { type: String, required: true, index: true },
  noMr: { type: String, index: true },
  tanggal: { type: String, default: '' },
  namaPetugas: { type: String, default: '' },
  namaPasienAtauPJ: { type: String, default: '' },
  ttdPetugas: { type: String, default: '' },
  ttdPasien: { type: String, default: '' }
}, {
  timestamps: true,
  collection: 'tata_tertib_ranap'
});

module.exports = mongoose.model('TataTertibRanap', TataTertibRanapSchema);
