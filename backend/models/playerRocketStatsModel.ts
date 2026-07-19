import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";

const Schema = mongoose.Schema;

interface PlayerRocketStatsDoc extends PlayerStatsDoc {
    score : number;
    goals : number;
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

export default mongoose.model('PlayerRocketStats', playerRocketStatsSchema)