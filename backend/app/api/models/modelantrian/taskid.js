const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const TaskidSchema = new Schema({
    kodebooking: {
        type: String,
        trim: true,
        default: ''
    },
    task1: {
        type: Number,
        trim: true,
        default: 0
    },
    task2: {
        type: Number,
        trim: true,
        default: 0
    },
    task3: {
        type: Number,
        trim: true,
        default: 0
    },
    task4: {
        type: Number,
        trim: true,
        default: 0
    },
    task5: {
        type: Number, 
        trim: true,
        default: 0
    },
    task6: {
        type: Number,
        trim: true,
        default: 0
    },
    task7: {
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

module.exports = mongoose.model("Taskid", TaskidSchema);
