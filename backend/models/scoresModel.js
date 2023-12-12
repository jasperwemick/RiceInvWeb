const mongoose = require('mongoose')

const Schema = mongoose.Schema

const scoreSchema = new Schema({
    brawlPoints: {
        type: Number,
        required: true
    },
    leaguePoints: {
        type: Number,
        required: true
    },
    valPoints: {
        type: Number, 
        required: true
    },
    bullPoints: {
        type: Number,
        required: true
    },
    rocketPoints: {
        type: Number,
        required: true
    },
    mysteryPoints: {
        type: Number,
        required: true
    },
    counterPoints: {
        type: Number,
        required: true
    },
    bonusPoints: {
        type: Number,
        required: true
    }
}, { timestamps: false })

module.exports = mongoose.model('Score', scoreSchema)