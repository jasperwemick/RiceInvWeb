import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";

const Schema = mongoose.Schema;

interface PlayerValorantStatsDoc extends PlayerStatsDoc {
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

export default mongoose.model('PlayerValorantStats', playerValorantStatsSchema)