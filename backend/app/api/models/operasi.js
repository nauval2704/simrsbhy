const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const OperasiSchema = new Schema({
    nopeserta: {
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
    kodebooking: {
        type: String,
        trim: true,
        required: true
    },
    tanggaloperasi: {
        type: Date,
        trim: true,
        required: true
    },
    jenistindakan: {
        type: String,
        trim: true,
        required: true
    },
    kodepoli: {
        type: String,
        trim: true,
        required: true
    },
    namapoli: {
        type: String,
        trim: true,
        required: true
    },
    terlaksana: {
        type: Number,
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
module.exports = mongoose.model('Operasi', OperasiSchema)