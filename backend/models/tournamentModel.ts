import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface TournamentDoc extends Document {
    tournamentId : number;
    gameMode : mongoose.Schema.Types.ObjectId;
    sets : mongoose.Schema.Types.ObjectId[];
}

const tournamentSchema = new Schema<TournamentDoc>({
    tournamentId : {
        type: Number,
        required: true
    },
    gameMode : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'GameMode',
        required: true
    },
    sets : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Set',
        required : true
    }]

}, { timestamps: false });


export default mongoose.model('tournament', tournamentSchema)