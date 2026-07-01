//Set up mongoose connection
const mongoose = require("mongoose");
// prod
// const mongoDB = ""; 
// dev
const mongoDB = "mongodb://127.0.0.1:27017/simrsbhy";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, 
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
