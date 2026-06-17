const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;
const practitioneriSchema = new Schema({
    nik: {
        type: String,
        trim: true,
        required: true
    },
    nama: {
        type: String,
        trim: true,
    },
    nomorIhs: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        trim: true,
        default: () => moment().format('YYYY-MM-DD HH:mm:ss')
    }
});
module.exports = mongoose.model('Practitioner', practitioneriSchema)