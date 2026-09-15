const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const DokterSchema = new Schema({
    nik: {
        type: String,
        trim: true,
    },
    namadokter: {
        type: String,
        trim: true,
    },
    kodedokter: {
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

module.exports = mongoose.model("Dokter", DokterSchema);
