const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    },
    rice_points: {
        type: Number,
        required: true
    }
}, { timestamps: false })

module.exports = mongoose.model('Account', accountSchema)