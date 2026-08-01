const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TataTertibRanapSchema = new Schema(
  {
    noCheckin: { type: String, required: true, index: true },
    noMr: { type: String, default: "" },
    tanggal: { type: String, default: "" },
    namaPetugas: { type: String, default: "" },
    namaPasienAtauPJ: { type: String, default: "" },
    ttdPetugas: { type: String, default: "" },
    ttdPasien: { type: String, default: "" }
  },
  { timestamps: true, collection: "tata_tertib_ranap", strict: false }
);

module.exports = mongoose.model("TataTertibRanap", TataTertibRanapSchema);
