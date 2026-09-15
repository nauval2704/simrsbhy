const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const JadwalOperasiSchema = new Schema({
    kodebooking: {
        type: String,
        trim: true,
    },
    tanggaloperasi: {
        type: String,
        trim: true,
    },
    jenistindakan: {
        type: String,
        trim: true,
    },
    kodepoli: {
        type: String,
        trim: true,
    },
    namapoli: {
        type: String,
        trim: true,
        default: ""
    },
    terlaksana: {
        type: Number,
        trim: true,
        default: 0
    },
    nopeserta: {
        type: String,
        trim: true,
        default: ""
    }, 
    createdAt: {
        type: String,
        default: () => moment().format("YYYY-MM-DD HH:mm:ss"),
    },
    lastupdate: {
        type: Number,
        default: moment().unix() * 1000,
    },
});

module.exports = mongoose.model("JadwalOperasi", JadwalOperasiSchema);
