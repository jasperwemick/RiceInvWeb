import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface MatchDoc extends Document {
    matchNumber : Number;
    teamAWin : boolean;
    duration : Number;
}

const matchSchema = new Schema<MatchDoc>({
    matchNumber : {
        type : Number,
        required : true,
        default : 1
    },
    teamAWin : { // Lower seed defeats upper seed
        type : Boolean,
        required : true,
        default : true
    },
    duration : {
        type : Number
    }

}, { timestamps: false });

export default mongoose.model<MatchDoc>('Match', matchSchema)