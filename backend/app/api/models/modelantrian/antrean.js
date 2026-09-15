const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const AntreanSchema = new Schema({
    kodebooking: {
        type: String,
        trim: true,
        required: true,
    },
    jenispasien: {
        type: String,
        trim: true,
        default: 'JKN',
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
    namapoli: {
        type: String,
        trim: true,
    },
    pasienbaru: {
        type: Number,
        trim: true,
        default: 0,
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
        type: Number,
        trim: true,
    },
    namadokter: {
        type: String,
        trim: true,
    },
    jampraktek: {
        type: String,
        trim: true,
    },
    jeniskunjungan: {
        type: Number,
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
    angkaantrean: {
        type: Number,
        trim: true,
    },
    estimasidilayani: {
        type: Number, // Assuming this is a timestamp in milliseconds
        default: null,
    },
    sisakuotajkn: {
        type: Number,
        default: 0,
    },
    kuotajkn: {
        type: Number,
        default: 0,
    },
    sisakuotanonjkn: {
        type: Number,
        default: 0, 
    },
    kuotanonjkn: {
        type: Number,
        default: 0,
    },
    keterangan: {
        type: String,
        trim: true,
        default: "Peserta harap 60 menit lebih awal guna pencatatan administrasi.",
    },
    jenisresep: {
        type: String,
        trim: true,
    },
    status: {
        type: Number,
        default: 0,
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

module.exports = mongoose.model("Antrean", AntreanSchema);
