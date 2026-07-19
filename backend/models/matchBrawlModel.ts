import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

interface matchBrawlDoc extends MatchDoc {
    map : string;
}

const matchBrawlSchema = new Schema<matchBrawlDoc>({
    map: {
        type: String,
        required: true
    }
}, { timestamps: false });

export default mongoose.model('BrawlMatch', matchBrawlSchema)