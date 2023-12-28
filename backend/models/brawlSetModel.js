const mongoose = require('mongoose')

const Schema = mongoose.Schema

const brawlSetSchema = new Schema({
    setNumber: {
        type: Number,
        required: true
    },
    gameType: {
        type: Number,
        required: true
    },
    formatType: {
        type: String,
        required: true
    },

    
}, { timestamps: false })

module.exports = mongoose.model('BrawlSet', brawlSetSchema)