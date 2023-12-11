const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    lectures: [{
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        room: {
            type: String,
            required: true
        },
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            required: true
        }
    }]
    
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;
