const mongoose = require("mongoose");
const moment = require("moment");

//Define a schema
const Schema = mongoose.Schema;
const JasaDokterSchema = new Schema({
    noCheckin: {
        type: String,
    },
    namaDpjp: {
        type: String,
    },
    nama: {
        type: String,
    },
    tglInput: {
        type: String,
    },
    tglOut: {
        type: String,
    },
    adm: {
        type: Number,
    },
    dpjp: {
        type: Number,
    },
    obat: {
        type: Number,
    },
    lab: {
        type: Number,
    },
    radiologi: {
        type: Number,
    },
    ekg: {
        type: Number,
    },
    bhp: {
        type: Number,
    },
    inacbgs: {
        type: Number,
    },
    bruto: {
        type: Number,
    },
    percentage: {
        type: Number,
    },
    jasa: {
        type: Number,
    },
    user: {
        type: String,
    },
    createdAt: {
        type: Number,
        required: true,
        default: moment(),
    },
});
module.exports = mongoose.model("JasaDokter", JasaDokterSchema);