const mongoose = require('mongoose')

const Schema = mongoose.Schema

const valorantProfileSchema = new Schema({
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
    gameWins: {
        type: Number,
        required: true
    },
    averageACS: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
    },
    roundWins: {
        type: Number,
    },
    roundLosses: {
        type: Number,
    },
    favoriteAgent: {
        type: String,
    },
    favoriteMap: {
        type: String,
    },
    bestGame: {
        type: Number,
    },
}, { timestamps: false })

module.exports = mongoose.model('ValorantProfile', valorantProfileSchema)