const mongoose = require('mongoose')

const Schema = mongoose.Schema

const riceEventSchema = new Schema({
    time: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    eventType: {
        type: String,
        required: true 
    },
    game: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    people: [{
        type: String
    }],
    finished: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('RiceEvent', riceEventSchema)