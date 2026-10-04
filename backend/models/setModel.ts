import mongoose, { Document, PopulatedDoc } from "mongoose";
import { TeamDoc } from "./teamModel";
import { MatchDoc } from "./matchModel";
import { ProfileDoc } from "./profileModel";
import { Participant } from "../types/types";
import { TournamentStageDoc } from "./tournamentStageModel";

const Schema = mongoose.Schema;

export interface SetDoc extends Document {
    order : number;
    bestOf : number;
    subStage : PopulatedDoc<TournamentStageDoc>;
    setName : string;
    participants : Participant[];
    participantType : 'Profile' | 'Team';
    parents : number[];
    lowerSetID : number;
    nextSetID : number;
    matches : MatchDoc[];
}

const setSchema = new Schema<SetDoc>({
    order : {
        type : Number,
        required : true
    },
    bestOf: {
        type: Number,
        required: true,
    },
    subStage : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'TournamentSubStage',
        required: true
    },
    setName : {
        type : String,
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
    },
    parents: [{
        type: String
    }],
    lowerSetID: {
        type: Number
    },
    nextSetID: {
        type: Number
    }

}, { timestamps: false });

setSchema.virtual('matches', {
    ref : 'Match',
    localField : '_id',
    foreignField : 'set'
});

setSchema.set('toObject', { virtuals : true });
setSchema.set('toJSON', { virtuals : true });

export default mongoose.model<SetDoc>('Set', setSchema)