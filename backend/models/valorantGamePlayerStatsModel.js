const mongoose = require('mongoose')

const Schema = mongoose.Schema

const leagueGamePlayerStatsSchema = new Schema({
    gameID: {
        type: String,
        required: true
    },
    profileID: {
        type: String,
        required: true
    },
    winner: {
        type: Boolean,
        reqiured: true
    },
    agent: {
        type: String,
        required: true
    },
    kills: {
        type: Number,
        required: true
    },
    deaths: {
        type: Number,
        required: true
    },
    assists: {
        type: Number,
        required: true
    },
    acs: {
        type: Number,
        required: true
    },
    econRating: {
        type: Number,
        required: true
    },
    firstBloods: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    subbed: {
        type: Boolean,
        default: false
    }
}, { timestamps: false })

module.exports = mongoose.model('LeagueGamePlayerStat', leagueGamePlayerStatsSchema)