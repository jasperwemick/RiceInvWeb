import mongoose, { Document, PopulatedDoc } from "mongoose";
import { TeamDoc } from "./teamModel";
import { MatchDoc } from "./matchModel";
import { ProfileDoc } from "./profileModel";
import { Participant } from "../types/types";

const Schema = mongoose.Schema;

export interface StageDoc extends Document {
    stage : string;
    formats : string[];
}

const stageSchema = new Schema<StageDoc>({
    stage : {
        type : String,
        required : true
    },
    formats : [{
        type : String,
    }],

}, { timestamps: false });


export default mongoose.model<StageDoc>('Stage', stageSchema)