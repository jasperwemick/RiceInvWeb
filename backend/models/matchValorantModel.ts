import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

interface MatchValorantDoc extends MatchDoc {
    game : 'Valorant';
    map : 'Split' | 'Bind' | 'Haven' | 'Ascent' | 'Pearl' | 'Sunset' | 'Lotus' | 'Corrode' | 'Icebox' | 'Fracture' | 'Abyss' | 'Breeze' | 'Summit';
    version : string;
}

const matchValorantSchema = new Schema<MatchValorantDoc>({
    map: {
        type: String,
        required: true
    },
    version: {
        type: String
    }
}, { timestamps: false });

export default mongoose.model<MatchValorantDoc>('ValorantMatch', matchValorantSchema)