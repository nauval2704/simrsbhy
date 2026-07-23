const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const EmployeeSchema = new Schema({
  namaKarumkit: {
    type: String,
    trim: true,
    default: null,
  },
  noKarumkit: {
    type: String,
    default: null,
  },
  namaKafarmasi: {
    type: String,
    trim: true,
    default: null,
  },
  noKafarmasi: {
    type: String,
    default: null,
  },
  namaApoteker: {
    type: String,
    trim: true,
    default: null,
  },
  noApoteker: {
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
module.exports = mongoose.model("Employee", EmployeeSchema);
