import mongoose, { Document, PopulatedDoc } from "mongoose";
import profileModel, { ProfileDoc } from "./profileModel";
import Game from "../models/gameModel";
import { MatchDoc } from "./matchModel";

const Schema = mongoose.Schema;

export interface PlayerStatsDoc extends Document {
    playerProfile : mongoose.Types.ObjectId;
    match : PopulatedDoc<MatchDoc>;
    game : string;
    gameMode : string;
    type : string;
    calculateMatchRating() : number;
}

export const playerStatsSchema = new Schema({
    playerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Profile',
        required: true
    },
    match : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Match',
        required: true
    },
    game : {
        type : String,
        required : true
    },
    gameMode : {
        type: String,
        required : true
    },
}, { discriminatorKey : 'type', collection : 'playerstats'});

playerStatsSchema.methods.calculateMatchRating = function (doc : PlayerStatsDoc) : number {
    throw new Error(`calculateMatchRating() not implemented for type : ${doc.type}`)
}

playerStatsSchema.pre('save', async function(next) {
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
                throw new Error('Game for player stats does not exist. Game must be created first');
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

playerStatsSchema.post('save', async function (doc : PlayerStatsDoc) {
    try {
        const populatedDoc = await doc.populate('match');
        const matchRating = populatedDoc.calculateMatchRating();
        const profile = await profileModel.findById(doc.playerProfile);

        const Model = this.constructor as mongoose.Model<PlayerStatsDoc>;
        const count = await Model.countDocuments({ playerProfile : doc.playerProfile });

        if (!profile) {
            throw new Error("Profile does not exist.");
        }

        const currentRating = profile.gameProfiles.find(x => x.game == doc.game)?.gameModes.find(x => x.mode == doc.gameMode)?.rating;
        const newRating = (matchRating * 1 / count) + (currentRating ? (currentRating * (count - 1) / count) : 0);
        
        await profile.updateOne(
            {
                $set : {
                    'gameProfiles.$[gp].gameModes.$[gm].rating' : newRating,
                } 
            },
            {
                arrayFilters : [
                    { 'gp.game' : doc.game },
                    { 'gm.mode' : doc.gameMode }
                ]
            }
        )
    }
    catch(e) {

    }
})

export default mongoose.model<PlayerStatsDoc>('PlayerStats', playerStatsSchema)