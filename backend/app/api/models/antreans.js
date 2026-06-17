const mongoose = require('mongoose');

// add a day
var dateawal = new Date();
dateawal.setHours(00, 00, 01);
var date1 = dateawal.setDate(dateawal.getDate() + 1);

var dateakhir = new Date();
dateakhir.setHours(23, 59, 59);
var date7 = dateakhir.setDate(dateakhir.getDate() + 7);

//Define a schema
const Schema = mongoose.Schema;
const AntreanSchema = new Schema({
    nomorkartu: {
        type: String,
        validate: {
            validator: function (v) {
                return /^([0-9]{13}$)/.test(v);
            },
            message: props => `${props.value} harus 13 digit number`
        },
        trim: true,
        required: true
    },
    nik: {
        type: String,
        validate: {
            validator: function (v) {
                return /^([0-9]{16}$)/.test(v);
            },
            message: props => `${props.value} harus 16 digit number`
        },
        trim: true,
        required: true
    },
    nomorrm: {
        type: String,
        trim: true,
        required: true
    },
    notelp: {
        type: String,
        trim: true,
        required: true
    },
    tanggalperiksa: {
        type: Date,
        min: date1,
        max: date7,
        trim: true,
        required: true
    },
    kodepoli: {
        type: String,
        trim: true,
        required: true
    },
    nomorreferensi: {
        type: String,
        trim: true,
        required: true
    },
    jenisreferensi: {
        type: Number,
        min: 1,
        max: 2,
        trim: true,
        required: true
    },
    jenisrequest: {
        type: Number,
        min: 1,
        max: 2,
        trim: true,
        required: true
    },
    polieksekutif: {
        type: Number,
        min: 0,
        max: 1,
        trim: true,
        required: true
    },
    terlayani: {
        type: String,
        trim: true,
        required: true,
        default: 0
    },
    tglinput: {
        type: Date,
        trim: true,
        required: true,
        default: Date.now
    }
});
module.exports = mongoose.model('Antrean', AntreanSchema)