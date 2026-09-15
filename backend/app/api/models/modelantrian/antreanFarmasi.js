const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const AntreanFarmasiSchema = new Schema({
    jenispasien: {
        type: String,
        trim: true,
        default: 'JKN'
    },
    pasienbaru: {
        type: Number,
        trim: true,
        default: 0
    },
    nomorkartu: {
        type: String,
        trim: true,
    },
    nik: {
        type: String,
        trim: true,
    },
    nohp: {
        type: String,
        trim: true,
    },
    kodepoli: {
        type: String,
        trim: true,
    },
    norm: {
        type: String,
        trim: true,
    },
    tanggalperiksa: {
        type: String,
        trim: true,
    },
    kodedokter: {
        type: String,
        trim: true,
    },
    jampraktek: {
        type: String,
        trim: true,
    },
    jeniskunjungan: {
        type: String,
        trim: true,
    },
    nomorreferensi: {
        type: String,
        trim: true,
    },
    nomorantrean: {
        type: String,
        trim: true,
    },
    angkaAntrean: {
        type: Number,
        trim: true,
    },
    kodebooking: {
        type: String,
        trim: true,
    },
    status: {
        type: Number,
        trim: true,
        default: 0 
    },
    keterangan: {
        type: String,
        trim: true,
        default: ""
    },
    jenisresep: {
        type: String,
        trim: true,
        default: ""
    },
    createdAt: {
        type: String,
        default: () => moment().format("YYYY-MM-DD HH:mm:ss"),
    },
    updatedAt: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model("AntreanFarmasi", AntreanFarmasiSchema);
