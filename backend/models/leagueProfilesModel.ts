import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

interface LeagueProfileDoc extends Document{
    playerID : string;
    participated : boolean;
    games : number[];
    placing : number;
    riftWins : number;
    aramWins : number;
    favoriteChampion : string;
    bestGame : number;
}

const leagueProfileSchema = new Schema<LeagueProfileDoc>({
    playerID: {
        type: String,
        required: true
    },
    participated: {
        type: Boolean,
        required: true
    },
    games: [{
        type: Number
    }],
    placing: {
        type: Number,
        required: true
    },
    riftWins: {
        type: Number,
        required: true
    },
    aramWins: {
        type: Number,
        required: true
    },
    favoriteChampion: {
        type: String,
    },
    bestGame: {
        type: Number,
    },

    
}, { timestamps: false });

export default mongoose.model('LeagueProfile', leagueProfileSchema)