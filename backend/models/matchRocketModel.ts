import mongoose, { Document } from "mongoose";
import matchModel, { MatchDoc, matchSchema } from "./matchModel";

const Schema = mongoose.Schema;

export interface MatchRocketDoc extends MatchDoc {
    game : 'Rocket';
    map : string;
}

const matchRocketSchema = new Schema<MatchRocketDoc>({
    map: {
        type: String,
        required: true
    }
}, { timestamps: false });

matchRocketSchema.add(matchSchema);

export default mongoose.model<MatchRocketDoc>('MatchRocket', matchRocketSchema)