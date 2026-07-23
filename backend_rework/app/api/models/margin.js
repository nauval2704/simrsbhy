const mongoose = require("mongoose");
var moment = require("moment");
//Define a schema
const Schema = mongoose.Schema;
const MarginSchema = new Schema({
  marginBpjsYankes: {
    type: Number,
    trim: true,
    default: 0,
  },
  marginUmum: {
    type: Number,
    trim: true,
    default: 0,
  },
  createdAt: {
    type: String,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedAt: {
    type: String,
    default: null,
  },
});
module.exports = mongoose.model("Margin", MarginSchema);
