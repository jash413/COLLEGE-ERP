const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    professor: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    }
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;
