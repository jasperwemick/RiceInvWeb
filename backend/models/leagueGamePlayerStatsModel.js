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
    role: {
        type: String,
        required: true
    },
    champion: {
        type: String,
        required: false
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
    damage: {
        type: Number,
        required: true
    },
    gold: {
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