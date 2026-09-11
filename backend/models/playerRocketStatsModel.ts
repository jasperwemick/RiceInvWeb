import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";
import { GameModeProfileBase, GameModeRocket } from "./profileModel";
import gameModel, { GameDoc } from "./gameModel";

const Schema = mongoose.Schema;

interface PlayerRocketStatsDoc extends PlayerStatsDoc {
    game : 'Rocket';
    gameMode : '1v1' | '3v3';
    score : number;
    goals : number;
    received : number;
    assists : number;
    saves : number;
    shots : number;
}

const playerRocketStatsSchema = new Schema<PlayerRocketStatsDoc>({
    score : {
        type : Number
    },
    goals : {
        type : Number,
        required : true
    },
    received : {
        type : Number,
        required : true
    },
    assists : {
        type : Number
    },
    saves : {
        type : Number
    },
    shots : {
        type : Number
    }
}, { timestamps: false })

playerRocketStatsSchema.add(playerStatsSchema);

playerRocketStatsSchema.methods.calculateMatchRating = function (doc : PlayerRocketStatsDoc) : number {

    if (doc.gameMode === '1v1') {
        return 0.6 + doc.goals * 0.15 - doc.received * 0.05;
    }
    else {
        const sigScore = (100 * doc.goals) + (50 * doc.assists) + (50 * doc.saves) + (10 * doc.shots);
        return 0.1 * doc.goals + 0.08 * doc.assists + 0.075 * doc.saves + 0.02 * doc.shots + 0.004 * (doc.score - sigScore);
    }
}

playerRocketStatsSchema.methods.generateNewGameModeProfile = function (doc : PlayerRocketStatsDoc, game : GameDoc) : GameModeRocket {
    return {
        mode : doc.gameMode,
        gameId : game._id,
        rank : 0,
        rating : doc.calculateMatchRating(),
        ricePoints : 0
    }
}

export default mongoose.model<PlayerRocketStatsDoc>('PlayerRocketStats', playerRocketStatsSchema)