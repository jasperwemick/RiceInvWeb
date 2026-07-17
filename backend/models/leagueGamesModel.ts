import mongoose from "mongoose";

const Schema = mongoose.Schema;

const leagueGameSchema = new Schema({
    gameNumber: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
    
    
}, { timestamps: false })

export default mongoose.model('LeagueGame', leagueGameSchema)