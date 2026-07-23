import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";

const Schema = mongoose.Schema;

interface PlayerBrawlStatsDoc extends PlayerStatsDoc {
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

export default mongoose.model<PlayerBrawlStatsDoc>('PlayerBrawlStats', playerBrawlStatsSchema)