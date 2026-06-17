const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const GudangSatuanSchema = new Schema({
  nama: {
    type: String,
    trim: true,
    require: true,
    default: "",
    unique: [true, "Duplicate nama"],
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
module.exports = mongoose.model("GudangSatuan", GudangSatuanSchema);
