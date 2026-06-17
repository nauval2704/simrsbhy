const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const RequestGudangSchema = new Schema({
  items: {
    type: [],
    require: [true, "cannot be null"],
    default: [],
  },
  from: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
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
module.exports = mongoose.model("RequestGudang", RequestGudangSchema);
