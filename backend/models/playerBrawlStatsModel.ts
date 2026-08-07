import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";
import { GameDoc } from "./gameModel";
import { GameModeBrawl } from "./profileModel";

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

playerBrawlStatsSchema.methods.generateNewGameModeProfile = function (doc : PlayerBrawlStatsDoc, game : GameDoc) : GameModeBrawl {
    return {
        mode : doc.gameMode,
        gameId : game._id,
        rank : 0,
        rating : doc.calculateMatchRating(),
        ricePoints : 0
    }
}

export default mongoose.model<PlayerBrawlStatsDoc>('PlayerBrawlStats', playerBrawlStatsSchema)