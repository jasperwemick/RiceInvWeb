import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface SetDoc extends Document {
    setId : number;
    tournament : mongoose.Schema.Types.ObjectId;
    bestOf : number;
    bracket : boolean;
    parents : string[];
    lowerSetID : number;
    nextSetID : number;
}

const setSchema = new Schema<SetDoc>({
    setId: {
        type: Number,
        required: true
    },
    tournament: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Tournament",
        required : true
    },
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


export default mongoose.model<SetDoc>('Set', setSchema)