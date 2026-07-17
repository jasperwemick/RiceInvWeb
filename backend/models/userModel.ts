import mongoose, { Document } from "mongoose";
import { hash, genSalt } from 'bcrypt';
import { sign } from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv()

const Schema = mongoose.Schema

export interface UserDoc extends Document {
    username : string;
    password : string;
    roles : string[];
    active : boolean;
    profile : mongoose.Schema.Types.ObjectId;
}

const userSchema = new Schema<UserDoc>({
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
    genSalt(10, (err, salt) => {
        if (err) return next(err);

        hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.pre('findOneAndUpdate', async function (next){
    const user = await this.model.findOne(this.getQuery())

    console.log('asjdflkajdfskl')
    console.log(user)//stankfish123

    if (user.isModified('password')) {
        return next();
    }

    genSalt(10, (err, salt) => {
        if (err) return next(err);

        hash(user.password, salt, (err, hash) => {
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

    if (!process.env.SECRET_ACCESS_TOKEN) {
        throw new Error("No secret access token available for JWT signature")
    }

    return sign(payload, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '300m'
    });
};

export default mongoose.model('User', userSchema)