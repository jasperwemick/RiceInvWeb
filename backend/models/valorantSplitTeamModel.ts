import mongoose from "mongoose";

const Schema = mongoose.Schema;

const valorantSplitTeamSchema = new Schema({
    splitID: {
        type: String,
        required: true
    },
    games: [{
        type: Number
    }],
    players: [{
        type: String,
        required: true
    }],
    teamName: {
        type: String,
        required: true
    },
    evp: {
        type: Number,
    },
}, { timestamps: false });

export default mongoose.model('ValorantSplitTeam', valorantSplitTeamSchema)