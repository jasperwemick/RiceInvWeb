import mongoose, { Document, PopulatedDoc } from "mongoose";
import { SetDoc } from "./setModel";
import { GameModeDoc } from "./gameModeModel";
import { ProfileDoc } from "./profileModel";

const Schema = mongoose.Schema;

export interface TournamentDoc extends Document {
    name : string;
    gameMode : PopulatedDoc<GameModeDoc>;
    players : PopulatedDoc<ProfileDoc>[];
}

const tournamentSchema = new Schema<TournamentDoc>({
    name : {
        type : String,
        required : true
    },
    gameMode : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'GameMode',
        required: true
    },
    players : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        required : true
    }]


}, { timestamps: false });


export default mongoose.model<TournamentDoc>('Tournament', tournamentSchema)