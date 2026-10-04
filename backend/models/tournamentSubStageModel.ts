import mongoose, { Document, PopulatedDoc } from "mongoose";
import { TeamDoc } from "./teamModel";
import { MatchDoc } from "./matchModel";
import { ProfileDoc } from "./profileModel";
import { Participant } from "../types/types";
import { TournamentDoc } from "./tournamentModel";

const Schema = mongoose.Schema;

export interface TournamentSubStageDoc extends Document {
    order : number;
    stage : mongoose.Types.ObjectId;
    name : string;
    format : string;
    members : Participant[];
    memberType : 'Profile' | 'Team';
}

const tournamentSubStageSchema = new Schema<TournamentSubStageDoc>({
    order : {
        type : Number,
        required : true
    },
    stage : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    name : {
        type : String,
    },
    format : {
        type : String,
        required : true
    },
    members : [{
        type : Schema.Types.ObjectId,
        ref : 'memberType',
        required : true
    }],
    memberType: {
        type: String,
        required: true,
        enum: ['Profile', 'Team'],
    },
}, { timestamps: false });


export default mongoose.model<TournamentSubStageDoc>('TournamentSubStage', tournamentSubStageSchema)