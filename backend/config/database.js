//Set up mongoose connection
const mongoose = require("mongoose");
// prod
const mongoDB = ""; 
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, 
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
