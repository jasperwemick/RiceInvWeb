import mongoose, { Document } from "mongoose";
import profileModel, { GameModeProfileBase } from "./profileModel";

const Schema = mongoose.Schema;

export interface PlayerStatsDoc extends Document {
    playerProfile : mongoose.Schema.Types.ObjectId;
    match : mongoose.Schema.Types.ObjectId;
    gameMode : string;
}

export const playerStatsSchema = new Schema({
    playerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        required: true
    },
    match : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    game : {
        type : String,
        required : true
    },
    gameMode : {
        type: String,
        required : true
    },
});

export default mongoose.model<PlayerStatsDoc>('PlayerStats', playerStatsSchema)