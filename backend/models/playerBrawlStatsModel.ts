import mongoose from "mongoose";
import { PlayerStatsDoc, playerStatsSchema } from "./playerStatsModel";
import profileModel, { ProfileDoc } from "./profileModel";
import Game from "../models/gameModel";

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
    try {
        const profile = await profileModel.findById<ProfileDoc>(stats.playerProfile);
        const exists = profile?.gameProfiles.find((gp) => {
            return gp.gameModes.find((gm) => {
                return gm.mode === stats.gameMode
            });
        });
        if (!exists) {
            const game = await Game.findOne({ name : stats.game })

            if (!game) {
                throw {
                    message : 'Game for player stats does not exist. Game must be created first'
                }
            }

            await profileModel.updateOne(
                { _id : stats.playerProfile }, 
                { $push : { 'gameProfiles.$.gameModes' : {
                    mode : stats.gameMode,
                    gameModeId : game?._id
                }}}
            )
        }
    }
    catch(e) {

    }
    finally {
        next();
    }
});

playerBrawlStatsSchema.post('save', async function (doc : PlayerBrawlStatsDoc) {
    try {
        const matchRating = doc.damage * 0.001 + doc.kills * 0.15 + doc.stocks * 0.1;
        const profile = await profileModel.findById(doc.playerProfile);

        const Model = this.constructor as mongoose.Model<PlayerBrawlStatsDoc>;
        const count = await Model.countDocuments({ playerProfile : doc.playerProfile })
        
        await profile?.updateOne(
            { $set : {'gameProfiles.$[gp].gameModes.$[gm].rating' : matchRating }}
        )
    }
    catch(e) {

    }
})

export default mongoose.model<PlayerBrawlStatsDoc>('PlayerBrawlStats', playerBrawlStatsSchema)