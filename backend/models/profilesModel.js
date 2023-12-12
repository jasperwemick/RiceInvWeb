const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema({
    name: {
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
    }
}, { timestamps: false })

module.exports = mongoose.model('Profile', profileSchema)