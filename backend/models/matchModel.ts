import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ProfileDoc } from "./profileModel";
import { TeamDoc } from "./teamModel";
import { Participant } from "../types/types";

const Schema = mongoose.Schema;

export interface MatchDoc extends Document {
    game : string;
    matchNumber : Number;
    matchSet : mongoose.Types.ObjectId;
    winner : Participant;
    winnerType : 'Profile' | 'Team';
}

export const matchSchema = new Schema<MatchDoc>({
    game : {
        type : String,
        required : true
    },
    matchNumber : {
        type : Number,
        required : true,
        default : 0
    },
    matchSet : {
        type : Schema.Types.ObjectId,
        ref : 'Set',
        required : true
    },
    winner : {
        type : Schema.Types.ObjectId,
        ref : 'winnerType',
        required : true
    },
    winnerType: {
        type: String,
        required: true,
        enum: ['Profile', 'Team'],
    },

}, { discriminatorKey : 'game', collection : 'matches'});

export default mongoose.model<MatchDoc>('Match', matchSchema);