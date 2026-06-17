const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;
const RequestApotekchema = new Schema({
  items: {
    type: [],
    require: [true, "cannot be null"],
    default: [],
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
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
module.exports = mongoose.model("RequestApotek", RequestApotekchema);
