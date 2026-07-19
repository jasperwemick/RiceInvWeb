import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface GameModeDoc extends Document {

}

const gameSchema = new Schema<GameModeDoc>({

}, { timestamps: false });

export default mongoose.model('GameMode', gameSchema)