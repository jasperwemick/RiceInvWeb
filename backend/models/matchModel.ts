import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface MatchDoc extends Document {
    matchNumber : Number;
    matchSet : mongoose.Schema.Types.ObjectId;
    winningTeam : mongoose.Schema.Types.ObjectId;
}

const matchSchema = new Schema<MatchDoc>({
    matchNumber : {
        type : Number,
        required : true,
        default : 1
    },
    matchSet : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Set',
        required : true
    },
    winningTeam : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Team',
        required : true
    }

}, { timestamps: false });

export default mongoose.model<MatchDoc>('Match', matchSchema)