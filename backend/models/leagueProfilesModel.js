const mongoose = require('mongoose')

const Schema = mongoose.Schema

const leagueProfileSchema = new Schema({
    playerID: {
        type: String,
        required: true
    },
    participated: {
        type: Boolean,
        required: true
    },
    games: [{
        type: Number
    }],
    placing: {
        type: Number,
        required: true
    },
    riftWins: {
        type: Number,
        required: true
    },
    aramWins: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
    },
    favoriteChampion: {
        type: String,
    },
    bestGame: {
        type: Number,
    },

    
}, { timestamps: false })

module.exports = mongoose.model('LeagueProfile', leagueProfileSchema)