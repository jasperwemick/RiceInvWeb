import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";

const Schema = mongoose.Schema;

interface PlayerBrawlStatsDoc extends PlayerStatsDoc {
    game : 'Brawl';
    gameMode : '1v1' | '2v2';
    legend : string;
    damage : number;
    kills : number;
    stocks : number;
}

const playerBrawlStatsSchema = new Schema<PlayerBrawlStatsDoc>({
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'MatchBrawl',
        required: true
    },
    legend : {
        type : String
    },
    damage : {
        type : Number
    },
    kills : {
        type : Number
    },
    stocks : {
        type : Number
    }
}, { timestamps: false })

playerBrawlStatsSchema.add(playerStatsSchema);

playerBrawlStatsSchema.methods.calculateMatchRating = function (doc : PlayerBrawlStatsDoc) : number {
    return doc.damage * 0.001 + doc.kills * 0.15 + doc.stocks * 0.1;
}

export default mongoose.model<PlayerBrawlStatsDoc>('PlayerBrawlStats', playerBrawlStatsSchema)