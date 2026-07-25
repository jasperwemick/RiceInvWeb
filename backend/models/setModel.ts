import mongoose, { Document, PopulatedDoc } from "mongoose";
import { TeamDoc } from "./teamModel";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

export interface SetDoc extends Document {
    setId : number;
    tournament : mongoose.Schema.Types.ObjectId;
    bestOf : number;
    bracket : boolean;
    teams : PopulatedDoc<TeamDoc>;
    parents : string[];
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
    bracket : {
        type : Boolean,
        required : true,
    },
    teams : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Team',
        required : true
    }],
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