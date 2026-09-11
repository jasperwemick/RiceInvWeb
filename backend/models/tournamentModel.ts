import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ProfileDoc } from "./profileModel";
import { TeamDoc } from "./teamModel";
import { Participant } from "../types/types";

const Schema = mongoose.Schema;

export interface TournamentDoc extends Document {
    name : string;
    gameMode : mongoose.Schema.Types.ObjectId;
    participants : Participant[];
    participantType : 'Profile' | 'Team';
}

const tournamentSchema = new Schema<TournamentDoc>({
    name : {
        type : String,
        required : true
    },
    gameMode : {
        type : mongoose.Schema.Types.ObjectId,
        required: true
    },
    participants : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'participantType',
        required : true
    }],
    participantType : {
        type : String,
        required : true,
        enum: ['Profile', 'Team'],
    }
}, { timestamps: false });


export default mongoose.model<TournamentDoc>('Tournament', tournamentSchema)