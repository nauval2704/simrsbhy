const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const GudangAlkesSchema = new Schema({
  kategori: {
    type: String,
    default: null,
  },
  nama: {
    type: String,
    trim: true,
    require: true,
    default: "",
    unique: [true, "Duplicate nama"],
  },
  satuan: {
    type: String,
    default: null,
  },
  jenis: {
    type: String,
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
module.exports = mongoose.model("GudangAlkes", GudangAlkesSchema);
