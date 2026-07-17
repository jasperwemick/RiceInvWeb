import mongoose from "mongoose";

const Schema = mongoose.Schema

const blacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        ref: "User"
    }
}, {timestamps: true});

export default mongoose.model('Blacklist', blacklistSchema)