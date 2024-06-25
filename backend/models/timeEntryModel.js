const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timeEntrySchema = new Schema({
    user: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    timeRange: [{
        type: Boolean,
        required: true
    }],
    
}, { timestamps: true })

module.exports = mongoose.model('TimeEntry', timeEntrySchema)