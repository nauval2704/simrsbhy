const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const provinsiSchema = new Schema({
    KODE_WILAYAH: {
        type: String,
        trim: true,
        required: true
    },
    MST_KODE_WILAYAH: {
        type: String,
        trim: true,
        required: true
    },
    NAMA: {
        type: String,
        trim: true,
        required: true
    },
    LEVEL: {
        type: String,
        trim: true,
        required: true
    }
});
module.exports = mongoose.model('Provinsi', provinsiSchema)