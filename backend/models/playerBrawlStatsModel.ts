import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";
import profileModel, { ProfileDoc } from "./profileModel";

const Schema = mongoose.Schema;

interface PlayerBrawlStatsDoc extends PlayerStatsDoc {
    game : 'Brawl';
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

playerBrawlStatsSchema.pre('save', async function(next) {
    const stats = this;
    const profile = await profileModel.findById<ProfileDoc>(stats.playerProfile);
    const exists = profile?.gameProfiles.find((gp) => {
        return gp.gameModes.find((gm) => {
            return gm.mode === stats.gameMode
        });
    });
    if (!exists) {
        profile.
    }
    next();
})

playerBrawlStatsSchema.post('save', async (doc : PlayerBrawlStatsDoc, next) => {
    try {
        const matchRating = doc.damage * 0.001 + doc.kills * 0.15 + doc.stocks * 0.1;
        const profile = await profileModel.updateOne(
            { _id : doc.playerProfile },
            { $set : {  } }
        );
        profile
    }
    catch(e) {

    }
})

export default mongoose.model<PlayerBrawlStatsDoc>('PlayerBrawlStats', playerBrawlStatsSchema)