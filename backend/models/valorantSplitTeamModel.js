const mongoose = require('mongoose')

const Schema = mongoose.Schema

const valorantSplitTeamSchema = new Schema({
    splitID: {
        type: String,
        required: true
    },
    games: [{
        type: Number
    }],
    players: [{
        type: String,
        required: true
    }],
    teamName: {
        type: String,
        required: true
    },
    evp: {
        type: Number,
    },
}, { timestamps: false })

module.exports = mongoose.model('ValorantSplitTeam', valorantSplitTeamSchema)