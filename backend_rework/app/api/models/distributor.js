const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const DistributorSchema = new Schema({
  nama: {
    type: String,
    trim: true,
    require: true,
    default: "",
    unique: [true, "Duplicate nama"],
  },
  alamat: {
    type: String,
    trim: true,
    default: "",
  },
  telp: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: String,
    trim: true,
    default: "",
  },
  updatedAt: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("Distributor", DistributorSchema);
