const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const moment = require("moment");
const UserSchema = new Schema({
    nama: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'ROLE_USER',
    },
    username: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    token: {
        type: String,
        default: ''
    },
    createdAt: {
        type: String,
        default: () => moment().format("YYYY-MM-DD HH:mm:ss"),
    },
});
// hash user password before saving into database
// UserSchema.pre('save', function (next) {
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
// });
module.exports = mongoose.model('User', UserSchema);