import mongoose, { PopulatedDoc } from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";
import { MatchValorantDoc } from "./matchValorantModel";

const Schema = mongoose.Schema;

interface PlayerValorantStatsDoc extends PlayerStatsDoc {
    game : 'Valorant';
    gameMode : '5v5';
    match : PopulatedDoc<MatchValorantDoc>
    agent : string;
    acs : number;
    kills : number;
    deaths : number;
    assists : number;
    adr : number;
    hsPercent : number;
    kast : number;
    fk : number;
    fd : number;
    mk : number;
}

const playerValorantStatsSchema = new Schema<PlayerValorantStatsDoc>({
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'MatchValorant',
        required: true
    },
    agent : {
        type : String,
        required : true
    },
    acs : {
        type : Number,
        required : true
    },
    kills : {
        type : Number,
        required : true
    },
    deaths : {
        type : Number,
        required : true
    },
    assists : {
        type : Number,
        required : true
    },
    adr : {
        type : Number,
        required : true
    },
    hsPercent : {
        type : Number,
        required : true
    },
    kast : {
        type : Number,
        required : true
    },
    fk : {
        type : Number,
        required : true
    },
    fd : {
        type : Number,
        required : true
    },
    mk : {
        type : Number,
        required : true
    },
}, { timestamps: false })

playerValorantStatsSchema.add(playerStatsSchema);

playerValorantStatsSchema.methods.calculateMatchRating = function (doc : PlayerValorantStatsDoc) : number {
    if (!doc.match || doc.match instanceof mongoose.Types.ObjectId) {
        throw new Error("Match not populated")
    }
    
    const t = doc.match.rounds;
    return ((0.2 * doc.kills / t) - (0.085 * doc.deaths / t) + (0.12 * doc.assists / t) + (0.6 * doc.kast)) * 0.65 + (0.04 * doc.fk / doc.fd) + (0.0045 * doc.adr) + (0.8 * doc.mk / t);
}

export default mongoose.model<PlayerValorantStatsDoc>('PlayerValorantStats', playerValorantStatsSchema)