import mongoose, { Document } from "mongoose";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

interface matchValorantDoc extends MatchDoc {
    map : 'Split' | 'Bind' | 'Haven' | 'Ascent' | 'Pearl' | 'Sunset' | 'Lotus' | 'Corrode' | 'Icebox' | 'Fracture' | 'Abyss' | 'Breeze' | 'Summit'
    version : string
}

const matchValorantSchema = new Schema<matchValorantDoc>({
    map: {
        type: String,
        required: true
    },
    version: {
        type: String
    }
}, { timestamps: false });

export default mongoose.model('ValorantMatch', matchValorantSchema)