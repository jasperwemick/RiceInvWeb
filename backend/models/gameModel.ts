import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface GameDoc extends Document {

}

const gameSchema = new Schema<GameDoc>({

}, { timestamps: false });

export default mongoose.model('Game', gameSchema)