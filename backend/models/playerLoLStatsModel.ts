import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";

const Schema = mongoose.Schema;

interface PlayerLoLStatsDoc extends PlayerStatsDoc {
    game : 'LoL';
    role : 'Top' | 'Mid' | 'ADC' | 'Support' | 'Jungle';
    kills : number;
    deaths : number;
    assists : number;
    damage : number;
    cs : number;
    gold : number;
    vision : number;
    level : number;
}

const playerLoLStatsSchema = new Schema<PlayerLoLStatsDoc>({
    role : {
        type : String,
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
    damage : {
        type : Number,
        required : true
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

export default mongoose.model<PlayerLoLStatsDoc>('PlayerLoLStats', playerLoLStatsSchema)