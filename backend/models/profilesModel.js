const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: false
    },
    image: {
        type: String,
        required: false
    },
    rice_points: {
        type: Number,
        required: true
    }
}, { timestamps: false })

module.exports = mongoose.model('Profile', profileSchema)