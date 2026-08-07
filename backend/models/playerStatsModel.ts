import mongoose, { Document, PopulatedDoc } from "mongoose";
import profileModel, { GameModeProfileBase, ProfileDoc } from "./profileModel";
import Game, { GameDoc } from "../models/gameModel";
import { MatchDoc } from "./matchModel";
import { MatchLoLDoc } from "./matchLoLModel";
import { MatchValorantDoc } from "./matchValorantModel";
import { MatchBrawlDoc } from "./matchBrawlModel";
import { MatchRocketDoc } from "./matchRocketModel";
import gameModel from "../models/gameModel";

const Schema = mongoose.Schema;

type AnyMatchDoc = MatchDoc | MatchBrawlDoc | MatchLoLDoc | MatchValorantDoc | MatchRocketDoc

export interface PlayerStatsDoc extends Document {
    playerProfile : mongoose.Types.ObjectId;
    match : PopulatedDoc<AnyMatchDoc>;
    game : string;
    gameMode : string;
    calculateMatchRating() : number;
    generateNewGameModeProfile(game : GameDoc) : GameModeProfileBase;
}

export const playerStatsSchema = new Schema<PlayerStatsDoc>({
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
}, { discriminatorKey : 'game', collection : 'playerstats'});

playerStatsSchema.methods.calculateMatchRating = function (doc : PlayerStatsDoc) : number {
    throw new Error(`calculateMatchRating() not implemented for type : ${doc.game}`)
}

playerStatsSchema.methods.generateNewGameModeProfile = function (doc : PlayerStatsDoc, game : GameDoc) : GameModeProfileBase {
    throw new Error(`generateNewGameModeProfile() not implemented for type : ${doc.game}`)
}

playerStatsSchema.pre('save', async function(next) {
    const stats = this;

    const session = await mongoose.startSession();

    try {

        const game = await gameModel.findOne<GameDoc>({ name : stats.game });

        session.startTransaction();

        const gamePush = await profileModel.updateOne(
            {
                _id: stats.playerProfile,
                'gameProfiles.game': stats.game,
                'gameProfiles.gameModes.mode': { $ne: stats.gameMode },
            },
            {
                $push: { 'gameProfiles.$.gameModes': stats.generateNewGameModeProfile(game) },
            },
            { session : session }
        );

        if (gamePush.modifiedCount > 0) {
            return; // done — GameProfile existed, GameMode didn't, now it does
        }
        const gmPush = await profileModel.updateOne(
            {
                _id: stats.playerProfile,
                'gameProfiles.game': { $ne: stats.game },
            },
            {
                $push: {
                    gameProfiles: {
                        game : stats.game,
                        gameModes: [stats.generateNewGameModeProfile(game)],
                        // any other required GameProfile base fields go here
                    },
                },
            },
            { session : session }
        );

        await session.commitTransaction();
    }
    catch(e) {
        await session.abortTransaction();
        console.log("Error at pre 'save' hook for PlayerStats: ", e);
    }
    finally {
        await session.endSession();
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