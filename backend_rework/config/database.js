//Set up mongoose connection
const mongoose = require("mongoose");
// prod
// const mongoDB = process.env.MONGODB_URI_PROD;
// dev
// const mongoDB = process.env.MONGODB_URI_DEV;
// local
const mongoDB = process.env.MONGODB_URI_LOCAL;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
