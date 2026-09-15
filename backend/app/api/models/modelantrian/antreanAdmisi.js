const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const AntreanAdmisiSchema = new Schema({
    tanggalperiksa: {
        type: String,
        trim: true,
    },
    nomorantrean: {
        type: String,
        trim: true,
    },
    kodebooking: {
        type: String,
        trim: true,
    },
    angkaantrean: {
        type: Number,
        trim: true,
    },
    status: {
        type: Number, 
        trim: true,
        default: 0
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

module.exports = mongoose.model("AntreanAdmisi", AntreanAdmisiSchema);
