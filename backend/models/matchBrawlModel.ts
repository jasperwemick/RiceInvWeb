import mongoose, { Document } from "mongoose";
import { MatchDoc, matchSchema } from "./matchModel";

const Schema = mongoose.Schema;

export interface MatchBrawlDoc extends MatchDoc {
    game : 'Brawl';
    map : string;
}

const matchBrawlSchema = new Schema<MatchBrawlDoc>({
    map: {
        type: String,
        required: true
    }
}, { timestamps: false });

matchBrawlSchema.add(matchSchema);

export default mongoose.model<MatchBrawlDoc>('MatchBrawl', matchBrawlSchema)