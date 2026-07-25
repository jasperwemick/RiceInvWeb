import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface PlayerStatsDoc extends Document {
    profile : mongoose.Schema.Types.ObjectId;
    match : mongoose.Schema.Types.ObjectId;
    // team : mongoose.Schema.Types.ObjectId;
}

export const playerStatsSchema = new Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    // team: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Team',
    //     required: true,
    // },
})

export default mongoose.model<PlayerStatsDoc>('PlayerStats', playerStatsSchema)