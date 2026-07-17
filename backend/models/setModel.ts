import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface setDoc extends Document {
    setID : number;
    gameTag : string;
    upperSeedProfiles : mongoose.Schema.Types.ObjectId[];
    upperSeedWins : number;
    lowerSeedProfiles : mongoose.Schema.Types.ObjectId[];
    lowerSeedWins : number;
    bestOf : number;
    parents : string[];
    lowerSetID : number;
    nextSetID : number;
}

const setSchema = new Schema<setDoc>({
    setID: {
        type: Number,
        required: true
    },
    gameTag: {
        type: String,
        required: true
    },
    upperSeedProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }],
    upperSeedWins: {
        type: Number,
        required: true,
    },
    lowerSeedProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }],
    lowerSeedWins: {
        type: Number,
        required: true,
    },
    bestOf: {
        type: Number,
        required: true,
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


setSchema.post('findOneAndUpdate', async function(doc, next) {

});

export default mongoose.model('Set', setSchema)