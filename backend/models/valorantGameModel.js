const mongoose = require('mongoose')

const Schema = mongoose.Schema

const valorantGameSchema = new Schema({
    splitID: {
        type: String,
        required: true
    },
    gameNumber: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    map: {
        type: String,
        required: true
    },
    version: {
        type: String
    }
}, { timestamps: false })

module.exports = mongoose.model('ValorantGame', valorantGameSchema)