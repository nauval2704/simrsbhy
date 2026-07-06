//Set up mongoose connection
const mongoose = require("mongoose");
// prod
// const mongoDB = "mongodb://rsbhayangkara:poldaaceh2021@36.66.36.106:29017/simrsba";
// dev
// const mongoDB = "mongodb://rsbhayangkara:poldaaceh2021@103.76.174.237/simrsba";
// local
const mongoDB = "mongodb://localhost:27017/simrsbhy";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
