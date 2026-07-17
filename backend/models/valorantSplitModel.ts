import mongoose from "mongoose";

const Schema = mongoose.Schema;

const valorantSplitSchema = new Schema({
    games: [{
        type: Number
    }],
    gameWins: {
        type: Number,
        required: true
    },
    averageACS: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
    },
    roundWins: {
        type: Number,
    },
    roundLosses: {
        type: Number,
    },
    favoriteAgent: {
        type: String,
    },
    favoriteMap: {
        type: String,
    },
    bestGame: {
        type: Number,
    },
}, { timestamps: false });

export default mongoose.model('ValorantSplit', valorantSplitSchema)