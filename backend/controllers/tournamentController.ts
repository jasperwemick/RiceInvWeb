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
import { matchBaseSchema, newMatchSchema, newSetSchema, newTournamentSchema, profileSchema, profilesSchema } from "../types/validation";
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
        const sets = await Set.find<SetDoc>({ tournament : tid }).populate('participants').populate('matches').exec();
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

export const getTournamentSet = async (req : Request, res : Response) => {
    const tid = req.params.tid;
    const sid = req.params.sid;
    const num = req.params.num;
    try {
        const sets = await Set.find<SetDoc>({ tournament : tid, stage : sid, setId : num }).populate('participants').populate('matches').exec();
        res.json(sets);
    }
    catch(e) {
        console.log('Error at GET /tournament/:tid/stage/:sid/set/:num', e)
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
        const { gameMode, participants } = tournament;
        const parsed = profilesSchema.safeParse(participants);
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
                        await BrawlStats.create([{ ...statData, match: matchId }], { session });
                    }
                    else if (pStat.format === 'LoL') {
                        const { format, ...statData } = pStat
                        await LoLStats.create([{ ...statData,  match: matchId }], { session });
                    }
                    else if (pStat.format === 'Valorant') {
                        const { format, ...statData } = pStat
                        await ValorantStats.create([{ ...statData, match: matchId }], { session });
                    }
                    else if (pStat.format === 'Rocket') {
                        const { format, ...statData } = pStat
                        await RocketStats.create([{ ...statData, match: matchId }], { session });
                    }
                }
            }
        }

        await session.commitTransaction();
        res.status(201).json(tournament);
    } 
    catch (e) {
        await session.abortTransaction();
        console.log("Error at POST /tournament: ", e);
        res.status(500).json({ error: "Failed to create tournament" });
    } 
    finally {
        await session.endSession();
    }
}

export const createTournamentSet = async (req : Request, res : Response) => {
    const body = newSetSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({ message: body.error.message });
    }
    try {
        const { matches, ...setData } = body.data;
        const newSet = await Set.create({
            ...setData
        });
        await newSet.save();
    }
    catch(e) {
        console.log("Error at POST /tournament/set: ", e);
        res.status(500).json({ error: "Failed to create tournament set" });
    }
}

export const createTournamentMatch = async (req : Request, res : Response) => {
    const body = newMatchSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({ message: body.error.message });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { playerStats, ...matchData } = body.data;
        const newMatch = await Match.create([{
            ...matchData
        }], { session });

        for (const ps of playerStats) {
            const { format, ...statData } = ps;
            const statsForMatch = { ...statData, match: matchData._id};
            switch (format) {
                case 'Brawl'    : await BrawlStats.create([{ ...statsForMatch }], { session }); break;
                case 'LoL'      : await LoLStats.create([{ ...statsForMatch }], { session }); break;
                case 'Valorant' : await ValorantStats.create([{ ...statsForMatch }], { session }); break;
                case 'Rocket'   : await RocketStats.create([{ ...statsForMatch }], { session }); break;
                default : console.log('Illegal format for Player Stats');
            };
        }

        await session.commitTransaction();
        res.status(201).json(newMatch);
    }
    catch(e) {
        await session.abortTransaction();
        console.log("Error at POST /tournament/set/match: ", e);
        res.status(500).json({ error: "Failed to create tournament match" });
    }
    finally {
        await session.endSession();
    }
}