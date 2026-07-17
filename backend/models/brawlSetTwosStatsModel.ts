import mongoose from "mongoose";

const Schema = mongoose.Schema;

const brawlSetTwosStatsSchema = new Schema({
    setID: {
        type: String,
        required: true
    },
    profileID: {
        type: String,
        required: true
    },
    winner: {
        type: Boolean,
        required: true
    },
    matchesWon: {
        type: Number,
        required: true
    },
    legendsPlayed: [{
        type: String,
    }],
    averageDamage: {
        type: Number
    }


}, { timestamps: false });

export default mongoose.model('brawlSetTwosStat', brawlSetTwosStatsSchema)