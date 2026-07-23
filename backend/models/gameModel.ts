import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface GameDoc extends Document {
    name : string;
}

const gameSchema = new Schema<GameDoc>({
    name : {
        type : String,
        required : true
    }
}, { timestamps: false });

export default mongoose.model<GameDoc>('Game', gameSchema)