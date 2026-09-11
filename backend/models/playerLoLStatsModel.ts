import mongoose, { PopulatedDoc } from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";
import MatchLoL, { MatchLoLDoc } from "./matchLoLModel";
import { GameDoc } from "./gameModel";
import { GameModeLoL } from "./profileModel";

const Schema = mongoose.Schema;

interface PlayerLoLStatsDoc extends PlayerStatsDoc {
    game : 'LoL';
    gameMode : 'ARAM' | 'Rift';
    match : PopulatedDoc<MatchLoLDoc>;
    role ? : 'Top' | 'Mid' | 'ADC' | 'Support' | 'Jungle';
    kills : number;
    deaths : number;
    assists : number;
    damage ? : number;
    cs ? : number;
    gold : number;
    vision ? : number;
    level : number;
}

const playerLoLStatsSchema = new Schema<PlayerLoLStatsDoc>({
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'MatchLoL',
        required: true
    },
    role : {
        type : String,
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
    damage : {
        type : Number,
    },
    cs : {
        type : Number,
    },
    gold : {
        type : Number,
        required : true
    },
    vision : {
        type : Number,
    },
    level : {
        type : Number,
        required : true
    },
}, { timestamps: false });

playerLoLStatsSchema.add(playerStatsSchema);

playerLoLStatsSchema.methods.calculateMatchRating = function (doc : PlayerLoLStatsDoc) : number {
    if (!doc.match || doc.match instanceof mongoose.Types.ObjectId) {
        throw new Error("Match not populated")
    }

    const t = doc.match.time;
    if (doc.gameMode === 'Rift') {
        return 2 * (0.336 - 1.437 * (doc.deaths / t) + 0.000117 * (doc.gold / t) + 0.443 * ((doc.kills + doc.assists) / t) + 0.264 * (doc.level / t) + 0.000013 * (doc.damage / t));
    }
    else {
        return 2 * (0.35 - 1.437 * (doc.deaths / t) + 0.000117 * (doc.gold / t) + 0.443 * ((doc.kills + doc.assists) / t) + 0.264 * (doc.level / t));
    }
}

playerLoLStatsSchema.methods.generateNewGameModeProfile = function (doc : PlayerLoLStatsDoc, game : GameDoc) : GameModeLoL {
    return {
        mode : doc.gameMode,
        gameId : game._id,
        rank : 0,
        rating : doc.calculateMatchRating(),
        ricePoints : 0
    }
}

export default mongoose.model<PlayerLoLStatsDoc>('PlayerLoLStats', playerLoLStatsSchema)