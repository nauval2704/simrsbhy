const mongoose = require("mongoose");
const moment = require("moment");


//Define a schema
const Schema = mongoose.Schema;
const LogsObatSchema = new Schema({
    depo: {
        type: String,
    },
    stockId: {
        type: Schema.Types.ObjectId,
    },
    quantity: {
        type: Number,
    },
    action: {
        type: String,
    },
    keterangan: {
        type: String,
    },
    user: {
        type: String,
    },
    createdAt: {
        type: Number,
        default: () => moment(),
    },
});
module.exports = mongoose.model("LogsObat", LogsObatSchema);
