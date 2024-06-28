const mongoose = require('mongoose')

const Schema = mongoose.Schema

const riceEventSchema = new Schema({
    tag: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: Number,
    },
    month: {
        type: Number,
    },
    day: {
        type: Number,
    },
    group: {
        type: String,
        required: true 
    },
    duration: {
        type: Number,
        required: true
    },
    timeRanges: [{
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
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }],
    ready: {
        type: Boolean,
        required: true
    },
    finished: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('RiceEvent', riceEventSchema)