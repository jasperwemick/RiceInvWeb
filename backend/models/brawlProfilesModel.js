const mongoose = require('mongoose')

const Schema = mongoose.Schema

const brawlProfileSchema = new Schema({
    playerID: {
        type: String,
        required: true
    },
    participated: {
        type: Boolean,
        required: true
    },
    sets: [{
        type: Number
    }],
    onesPlacing: {
        type: Number,
        required: true
    },
    twosPlacing: {
        type: Number,
        required: true
    },
    onesMatchWins: {
        type: Number,
        required: true
    },
    onesMatchLosses: {
        type: Number,
        required: true
    },
    twosMatchWins: {
        type: Number,
        required: true
    },
    twosMatchLosses: {
        type: Number,
        required: true
    },
    partner: {
        type: String,
        required: true
    },
    favoriteLegend: {
        type: String,
    },
    rival: {
        type: String,
    },

    
}, { timestamps: false })

module.exports = mongoose.model('BrawlProfile', brawlProfileSchema)