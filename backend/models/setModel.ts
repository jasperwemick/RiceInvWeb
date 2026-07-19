import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface SetDoc extends Document {
    setID : number;
    gameTag : string;
    matches : mongoose.Schema.Types.ObjectId[];
    bestOf : number;
    bracket : boolean;
    parents : string[];
    lowerSetID : number;
    nextSetID : number;
}

const setSchema = new Schema<SetDoc>({
    setID: {
        type: Number,
        required: true
    },
    gameTag: {
        type: String,
        required: true
    },
    matches : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    }],
    bestOf: {
        type: Number,
        required: true,
    },
    bracket : {
        type : Boolean,
        required : true,
    },
    parents: [{
        type: String
    }],
    lowerSetID: {
        type: Number
    },
    nextSetID: {
        type: Number
    }

}, { timestamps: false });


export default mongoose.model('Set', setSchema)