import mongoose, { Document, PopulatedDoc } from "mongoose";
import { TeamDoc } from "./teamModel";
import { MatchDoc } from "./matchModel";
import { ProfileDoc } from "./profileModel";
import { Participant } from "../types/types";
import { TournamentStageDoc } from "./tournamentStageModel";

const Schema = mongoose.Schema;

export interface SetDoc extends Document {
    setId : number;
    tournament : mongoose.Types.ObjectId;
    bestOf : number;
    stage : PopulatedDoc<TournamentStageDoc>;
    setName : string;
    participants : Participant[];
    participantType : 'Profile' | 'Team';
    parents : number[];
    lowerSetID : number;
    nextSetID : number;
    matches : MatchDoc[];
}

const setSchema = new Schema<SetDoc>({
    setId: {
        type: Number,
        required: true
    },
    tournament: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tournament',
        required : true
    },
    bestOf: {
        type: Number,
        required: true,
    },
    stage : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'TournamentStage',
        required: true
    },
    setName : {
        type : String,
        required : true
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
        type: Number
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