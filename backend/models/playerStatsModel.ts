import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface PlayerStatsDoc extends Document {
    profile : mongoose.Schema.Types.ObjectId;
    match : mongoose.Schema.Types.ObjectId;
    team : 'A' | 'B';
}

export const playerStatsSchema = new Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    team: {
        type: String,
        required: true,
        default : 'A'
    },
})

export default mongoose.model<PlayerStatsDoc>('PlayerStats', playerStatsSchema)