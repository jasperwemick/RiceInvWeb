import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ProfileDoc } from "./profileModel";

const Schema = mongoose.Schema;

export interface TeamDoc extends Document {
    name : String;
    tournament : mongoose.Schema.Types.ObjectId;
    members : PopulatedDoc<ProfileDoc>;
    placing : number
}

const teamSchema = new Schema<TeamDoc>({
    name : {
        type : String,
        required : true
    },
    tournament: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Tournament",
        required : true
    },
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        required : true
    }],
    placing : {
        type : Number
    }

}, { timestamps: false });


export default mongoose.model<TeamDoc>('Team', teamSchema)