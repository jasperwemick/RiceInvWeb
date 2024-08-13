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
    upperSeedProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }],
    upperSeedWins: {
        type: Number,
        required: true,
    },
    lowerSeedProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }],
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
    }],
    lowerSetID: {
        type: Number
    },
    nextSetID: {
        type: Number
    }

}, { timestamps: false })


setSchema.post('findOneAndUpdate', async function(doc, next) {

})

module.exports = mongoose.model('Set', setSchema)