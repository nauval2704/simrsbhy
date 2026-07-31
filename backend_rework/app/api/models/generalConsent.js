const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GeneralConsentSchema = new Schema(
  {
    noCheckin: { type: String, required: true, index: true },
    noMr: { type: String, default: "" },
    user: { type: String, default: "" },
    tglInput: { type: String, default: "" },
    data: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GeneralConsent", GeneralConsentSchema);
