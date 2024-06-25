const mongoose = require('mongoose')

const Schema = mongoose.Schema

const setSchema = new Schema({
    setID: {
        type: Number,
        required: true
    },
    gameTag: {
        type: String,
        required: true
    },
    upperSeed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    upperSeedWins: {
        type: Number,
        required: true,
    },
    lowerSeed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    lowerSeedWins: {
        type: Number,
        required: true,
    },
    bestOf: {
        type: Number,
        required: true,
    },
    parents: [{
        type: String
    }]

    
}, { timestamps: false })

module.exports = mongoose.model('Set', setSchema)