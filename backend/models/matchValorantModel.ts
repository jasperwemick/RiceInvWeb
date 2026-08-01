import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

export interface MatchValorantDoc extends MatchDoc {
    game : 'Valorant';
    map : 'Split' | 'Bind' | 'Haven' | 'Ascent' | 'Pearl' | 'Sunset' | 'Lotus' | 'Corrode' | 'Icebox' | 'Fracture' | 'Abyss' | 'Breeze' | 'Summit';
    rounds : number;
    version : string;
}

const matchValorantSchema = new Schema<MatchValorantDoc>({
    map: {
        type: String,
        required: true
    },
    rounds : {
        type : Number,
        required : true
    },
    version: {
        type: String
    }
}, { timestamps: false });

export default mongoose.model<MatchValorantDoc>('MatchValorant', matchValorantSchema)