const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    ricePoints: {
        type: Number,
        required: true
    },
    brawlPoints: {
        type: Number,
        required: true
    },
    leaguePoints: {
        type: Number,
        required: true
    },
    valPoints: {
        type: Number, 
        required: true
    },
    bullPoints: {
        type: Number,
        required: true
    },
    rocketPoints: {
        type: Number,
        required: true
    },
    mysteryPoints: {
        type: Number,
        required: true
    },
    counterPoints: {
        type: Number,
        required: true
    },
    bonusPoints: {
        type: Number,
        required: true
    }
}, { timestamps: false })

module.exports = mongoose.model('Profile', profileSchema)