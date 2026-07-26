import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

interface GameModeSchema {
    mode : string;
    description : string;
}

export interface GameDoc extends Document {
    name : string;
    fullName : string;
    description : string;
    gameModes : Types.DocumentArray<GameModeSchema & Document>
}

const gameModeSchema = new Schema<GameModeSchema>({
    mode : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
}, { timestamps: false })

const gameSchema = new Schema<GameDoc>({
    name : {
        type : String,
        required : true
    },
    fullName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    gameModes : [ gameModeSchema ]
}, { timestamps: false });

export default mongoose.model<GameDoc>('Game', gameSchema)