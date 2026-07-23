import { Request, Response } from "express";
import Tournament from "../models/tournamentModel";
import Set from "../models/setModel";

import BrawlMatch from "../models/matchBrawlModel";
import LoLMatch from "../models/matchLoLModel";
import ValorantMatch from "../models/matchValorantModel";
import RocketMatch from "../models/matchRocketModel";

import BrawlStats from "../models/matchBrawlModel";
import LoLStats from "../models/matchLoLModel";
import ValorantStats from "../models/matchValorantModel";
import RocketStats from "../models/matchRocketModel";

import Game from "../models/gameModel";
import GameMode from "../models/gameModeModel";

import { SetDoc } from "../models/setModel";
import mongoose from "mongoose";
import { newTournamentSchema } from "../types/validation";

export const getTournament = async (req : Request, res : Response) => {
    const id = req.params.id;

    try {
        const tournament = await Tournament.findById(id).exec()
        res.json(tournament)
    }
    catch(e) {
        console.log('Error at GET /tournament/:id', e)
    }
}

export const getTournamentsByGameId = async (req : Request, res : Response) => {
    const gameId = req.params.id;

    try {
        const gameModes = await GameMode.distinct('_id', { game : gameId }).exec();
        const tournaments = await Tournament.find({ gameMode : gameModes }).exec();

        res.json(tournaments);
    }
    catch(e) {
        console.log('Error at GET /tournament/gamemode/game/:id')
    }
}

export const getTournamentsByGameName = async (req : Request, res : Response) => {
    const gameName = req.params.name;

    try {
        const gameId = await Game.findOne({ name : gameName }).select('_id').lean().exec();
        const gameModes = await GameMode.find({ game : gameId }).exec();
        const tournaments = await Tournament.find({ gameMode : gameModes }).exec();

        res.json(tournaments);
    }
    catch(e) {
        console.log('Error at GET /tournament/gamemode/game/:name')
    }
}

export const getAllTournamentSets = async (req : Request, res : Response) => {
    const tid = req.params.tid;
    try {
        const sets = await Set.find({tournament : tid}).exec();
        res.json(sets);
    }
    catch(e) {
        console.log('Error at GET /tournament/:tid/sets', e)
        if (e instanceof Error) {
            res.json({
                data : [],
                message : e.message
            })
        }
    }
}

export const getAllPlayerTournaments = async (req : Request, res : Response) => {
    const pid = req.params.pid;
    try {
        const tournaments = await Tournament.find({ players : pid })
        res.json(tournaments);
    }
    catch(e) {
        console.log('Error at GET /tournament/player/:pid', e)
        if (e instanceof Error) {
            res.json({
                data : [],
                message : e.message
            })
        }
    }
}

interface PlayerSetsResult extends SetDoc {}

export const getPlayerTournamentSets = async (req : Request, res : Response) => {
    const tid = req.params.tid;
    const pid = req.params.pid;

    try {
        const sets = await Set.aggregate<PlayerSetsResult>([
            // 1. Narrow to the specific tournament
            { $match: { _id: tid } },

            // 2. Join in this Set's Matches — simple localField/foreignField, no pipeline needed
            {
                $lookup: {
                    from: 'matches',
                    localField: '_id',
                    foreignField: 'set',
                    as: 'matches'
                }
            },

            // 3. Join in PlayerStats for those matches, filtered to our specific profile
            //    (still needs a pipeline since we're filtering by a variable, not just joining)
            {
                $lookup: {
                    from: 'playerstats',
                    let: { matchIds: '$matches._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$match', '$$matchIds'] },
                                        { $eq: ['$profile', pid] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'matchingPlayerStats'
                }
            },

            // 4. Only keep Sets where we found a matching PlayerStats row
            { $match: { 'matchingPlayerStats.0': { $exists: true } } },

            // 5. Drop intermediate join fields
            { $project: { matches: 0, matchingPlayerStats: 0 } }
        ]);

        return sets;
    }
    catch(e) {
        console.log('Error at GET /tournament/:tid/player/:pid/sets', e)
        if (e instanceof Error) {
            res.json({
                data : [],
                message : e.message
            })
        }
    }
}

export const createTournament = async (req : Request, res : Response) => {
    const body = newTournamentSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({ message: body.error.message });
    }

    const { name, gameMode, players, sets } = body.data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tournament = await Tournament.create([{
            name, gameMode, players
        }], { session })

        const tournamentDoc = tournament[0];

        for (const setBody of sets) {

            const { matches, ...setData } = setBody;

            const set = await Set.create([{ tournament: tournamentDoc._id, ...setData }], { session });
            const setDoc = set[0];

            for (const matchBody of setBody.matches) {
                let matchId : mongoose.Types.ObjectId
                if (matchBody.format === 'Brawl') {
                    const { format, playerStats, ...matchData } = matchBody
                    const match = await BrawlMatch.create([{ set: setDoc._id, ...matchData }], { session });
                    matchId = match[0].id;
                }
                else if (matchBody.format === 'LoL') {
                    const { format, playerStats, ...matchData } = matchBody
                    const match = await LoLMatch.create([{ set: setDoc._id, ...matchData }], { session });
                    matchId = match[0].id;
                }
                else if (matchBody.format === 'Valorant') {
                    const { format, playerStats, ...matchData } = matchBody
                    const match = await ValorantMatch.create([{ set: setDoc._id, ...matchData }], { session });
                    matchId = match[0].id;
                }
                else {
                    const { format, playerStats, ...matchData } = matchBody
                    const match = await RocketMatch.create([{ set: setDoc._id, ...matchData }], { session });
                    matchId = match[0].id;
                }

                for (const pStat of matchBody.playerStats) {
                    if (pStat.format === 'Brawl') {
                        const { format, ...statData } = pStat
                        const statsForMatch = { ...statData, match: matchId};
                        await BrawlStats.create({ ...statsForMatch }, { session });
                    }
                    else if (pStat.format === 'LoL') {
                        const { format, ...statData } = pStat
                        const statsForMatch = { ...statData, match: matchId};
                        await LoLStats.create({ ...statsForMatch }, { session });
                    }
                    else if (pStat.format === 'Valorant') {
                        const { format, ...statData } = pStat
                        const statsForMatch = { ...statData, match: matchId};
                        await ValorantStats.create({ ...statsForMatch }, { session });
                    }
                    else if (pStat.format === 'Rocket') {
                        const { format, ...statData } = pStat
                        const statsForMatch = { ...statData, match: matchId};
                        await RocketStats.create({ ...statsForMatch }, { session });
                    }
                }
            }
        }

        await session.commitTransaction();
        res.status(201).json(tournamentDoc);
    } 
    catch (e) {
        await session.abortTransaction();
        console.log("Error at POST /tournament: ", e);
        res.status(500).json({ error: "Failed to create tournament" });
    } 
    finally {
        session.endSession();
    }
}