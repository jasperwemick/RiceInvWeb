import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface MatchDoc extends Document {
    matchId : Number;
    matchNumber : Number;
    teamAWin : boolean;
    playerData : mongoose.Schema.Types.ObjectId[];
    duration : Number;
}

const matchSchema = new Schema<MatchDoc>({
    matchId: {
        type: Number,
        required : true
    },
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
    playerData : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'PlayerStats',
        required: true
    }],
    duration : {
        type : Number
    }

}, { timestamps: false });

export default mongoose.model('Match', matchSchema)