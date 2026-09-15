const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const PoliSchema = new Schema({
    nmpoli: {
        type: String,
        trim: true,
    },
    nmsubspesialis: {
        type: String,
        trim: true,
    },
    kdsubspesialis: {
        type: String,
        trim: true,
    },
    kdpoli: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Number,
        default: moment().unix(),
    },
    updatedAt: {
        type: Number,
        default: moment().unix(),
    },
});

module.exports = mongoose.model("POLI", PoliSchema);
