import mongoose, { Document, PopulatedDoc } from "mongoose";
import { TeamDoc } from "./teamModel";
import { MatchDoc } from "./matchModel";
import { ProfileDoc } from "./profileModel";
import { Participant } from "../types/types";
import { TournamentDoc } from "./tournamentModel";

const Schema = mongoose.Schema;

export interface TournamentStageDoc extends Document {
    tournament :  mongoose.Types.ObjectId;
    order : number;
    stageType : 'Groups' | 'Playins' | 'Playoffs';
    format : string;
    stageName ? : string;
}

const tournamentStageSchema = new Schema<TournamentStageDoc>({
    tournament : {
        type :  mongoose.Schema.Types.ObjectId,
        required : true
    },
    order : {
        type : Number,
        required : true
    },
    stageType : {
        type : String,
        required : true
    },
    format : {
        type : String,
        required : true
    },
    stageName : {
        type : String,
    }

}, { timestamps: false });


export default mongoose.model<TournamentStageDoc>('TournamentStage', tournamentStageSchema)