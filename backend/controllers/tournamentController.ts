import { Request, Response } from "express";
import Tournament, { TournamentDoc } from "../models/tournamentModel";
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

import { SetDoc } from "../models/setModel";
import mongoose from "mongoose";
import { newTournamentSchema, profileSchema, profilesSchema } from "../types/validation";
import pl from "zod/v4/locales/pl.js";
import Team, { TeamDoc } from "../models/teamModel";
import Match from "../models/matchModel";

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
    const gameId = req.params.gid;

    try {
        const gameModes = await Game.distinct('gameModes._id', { _id : gameId })
        const tournaments = await Tournament.find({ gameMode : gameModes });
        res.json(tournaments);
    }
    catch(e) {
        console.log('Error at GET /tournament/gamemode/game/:gid')
    }
}

export const getTournamentsByGameName = async (req : Request, res : Response) => {
    const gameName = req.params.name;

    try {
        const gameModes = await Game.distinct('gameModes._id', { name : gameName })
        const tournaments = await Tournament.find({ gameMode : gameModes });

        res.json(tournaments);
    }
    catch(e) {
        console.log('Error at GET /tournament/gamemode/game/:name')
    }
}

export const getAllTournamentSets = async (req : Request, res : Response) => {
    const tid = req.params.tid;
    try {
        const sets = await Set.find<SetDoc>({ tournament : tid }).populate('teams').populate('matches').exec();
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
        const tournaments = await Tournament.find<TournamentDoc[]>({ players : pid })
        res.json(tournaments);
    }
    catch(e) {
        console.log('Error at GET /tournament/profile/:pid', e)
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
        const tournamentPlayerTeam = Team.findOne<TeamDoc>({ tournament : tid, members : pid });
        const sets = Set.find({ teams : tournamentPlayerTeam });
        res.json(sets);
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

export const getTournamentPlayerGameProfiles = async (req : Request, res : Response) => {
    const tid = req.params.tid;

    try {
        const tournament = await Tournament.findById<TournamentDoc>(tid).populate('players').exec();
        if (!tournament) {
            throw {
                message : 'Tournament with id' + tid + 'does not exist'
            }
        }
        const { gameMode, players } = tournament;
        const parsed = profilesSchema.safeParse(players);
        const gameProfiles = parsed.data?.map((profile) => {
            return profile.gameProfiles.map((gameProfile) => {
                const matchingMode = gameProfile.gameModes.find((x) => x.gameModeId === gameMode.toString())
                if (!matchingMode) {
                    return undefined
                }
                return { ...matchingMode, game : gameProfile.game, player : profile.name, profileId : profile._id }

            });
        });

        res.json(gameProfiles);
    }
    catch(e) {
        console.log('Error at GET /tournament/:tid/profile', e)
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