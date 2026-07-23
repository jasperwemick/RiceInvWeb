import mongoose, { Document, PopulatedDoc } from "mongoose";
import { GameDoc } from "./gameModel";

const Schema = mongoose.Schema;

export interface GameModeDoc extends Document {
    game : PopulatedDoc<GameDoc>;
    mode : string;
}

const gameModeSchema = new Schema<GameModeDoc>({
    game : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Game',
        required : true
    },
    mode : {
        type : String,
        required : true
    }
}, { timestamps: false });

export default mongoose.model<GameModeDoc>('GameMode', gameModeSchema)