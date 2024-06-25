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
    group: {
        type: String,
        required: true 
    },
    timeRange: [{
        type: Boolean,
        required: true
    }],
    participants: [{
        person: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        }
    }],
    finished: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('RiceEvent', riceEventSchema)