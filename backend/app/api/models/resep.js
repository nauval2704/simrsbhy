const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const ResepSchema = new Schema({
  noCheckin: {
    type: String,
    default: null,
  },
  obat: {
    type: [],
    default: [],
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
  user: {
    type: String,
    default: null,
  },
});
module.exports = mongoose.model("Resep", ResepSchema);
