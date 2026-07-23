import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

interface MatchLoLDoc extends MatchDoc {
    time : number;
}

const matchLoLSchema = new Schema<MatchLoLDoc>({
    time: {
        type: Number,
        required: true
    }
}, { timestamps: false })

export default mongoose.model<MatchLoLDoc>('LoLMatch', matchLoLSchema)