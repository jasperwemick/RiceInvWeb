import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

interface matchRocketDoc extends MatchDoc {
    map : string;
}

const matchRocketSchema = new Schema<matchRocketDoc>({
    map: {
        type: String,
        required: true
    }
}, { timestamps: false });

export default mongoose.model('RocketMatch', matchRocketSchema)