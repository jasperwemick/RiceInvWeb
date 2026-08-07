import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ProfileDoc } from "./profileModel";
import { GameDoc } from "./gameModel";

const Schema = mongoose.Schema;

export interface TeamDoc extends Document {
    name : String;
    game : PopulatedDoc<GameDoc>;
    members : PopulatedDoc<ProfileDoc>[];
    placing : number
}

const teamSchema = new Schema<TeamDoc>({
    name : {
        type : String,
        required : true
    },
    game : {
        type : mongoose.Types.ObjectId,
        ref : 'Game',
        required : true
    },
    members : [{
        type : mongoose.Types.ObjectId,
        ref : 'Profile',
        required : true
    }],
    placing : {
        type : Number
    }

}, { timestamps: false });


export default mongoose.model<TeamDoc>('Team', teamSchema)