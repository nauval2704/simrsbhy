const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const KodepoliSchema = new Schema({
 kdpoli: {
  type: String,
  trim: true,  
  required: true,
 },
 nmpoli: {
  type: String,
  trim: true,
  required: true
 }
});
module.exports = mongoose.model('Kodepoli', KodepoliSchema)