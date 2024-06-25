const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: 'Visitor'
    }],
    active: {
        type: Boolean,
        default: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },

});

userSchema.pre("save", function (next){
    const user = this;

    if (user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id
    };
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '30m'
    });
};

module.exports = mongoose.model('User', userSchema)