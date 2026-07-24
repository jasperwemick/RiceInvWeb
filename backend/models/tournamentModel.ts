import mongoose, { Document, PopulatedDoc } from "mongoose";
import { SetDoc } from "./setModel";
import { ProfileDoc } from "./profileModel";
import { GameDoc } from "./gameModel";

const Schema = mongoose.Schema;

export interface TournamentDoc extends Document {
    name : string;
    gameMode : mongoose.Schema.Types.ObjectId;
    players : PopulatedDoc<ProfileDoc>[];
}

const tournamentSchema = new Schema<TournamentDoc>({
    name : {
        type : String,
        required : true
    },
    gameMode : {
        type : mongoose.Schema.Types.ObjectId,
        required: true
    },
    players : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        required : true
    }]


}, { timestamps: false });


export default mongoose.model<TournamentDoc>('Tournament', tournamentSchema)