const mongoose = require('mongoose')

const Schema = mongoose.Schema

const leagueGameSchema = new Schema({
    gameNumber: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
    
    
}, { timestamps: false })

module.exports = mongoose.model('LeagueGame', leagueGameSchema)