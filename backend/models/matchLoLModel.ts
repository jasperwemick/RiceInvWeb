import mongoose, { Document } from "mongoose";
import { MatchDoc, matchSchema } from "./matchModel";

const Schema = mongoose.Schema;

export interface MatchLoLDoc extends MatchDoc {
    game : 'LoL'
}

const matchLoLSchema = new Schema<MatchLoLDoc>({

}, { timestamps: false });

matchLoLSchema.add(matchSchema);

export default mongoose.model<MatchLoLDoc>('MatchLoL', matchLoLSchema);