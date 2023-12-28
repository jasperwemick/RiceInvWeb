const mongoose = require('mongoose')

const Schema = mongoose.Schema

const brawlSetOnesStatsSchema = new Schema({
    setID: {
        type: String,
        required: true
    },
    profileID: {
        type: String,
        required: true
    },
    winner: {
        type: Boolean,
        required: true
    },
    matchesWon: {
        type: Number,
        required: true
    },
    legendsPlayed: [{
        type: String,
    }],
    averageDamage: {
        type: Number
    }


}, { timestamps: false })

module.exports = mongoose.model('brawlSetOnesStat', brawlSetOnesStatsSchema)