import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

interface MatchRocketDoc extends MatchDoc {
    game : 'Rocket';
    map : string;
}

const matchRocketSchema = new Schema<MatchRocketDoc>({
    map: {
        type: String,
        required: true
    }
}, { timestamps: false });

export default mongoose.model<MatchRocketDoc>('MatchRocket', matchRocketSchema)