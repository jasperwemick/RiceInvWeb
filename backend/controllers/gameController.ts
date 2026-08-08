import { Request, Response } from "express";
import Game, { GameDoc } from "../models/gameModel";
import PlayerStats, { PlayerStatsDoc } from '../models/playerStatsModel';

export const getGameById = async (req : Request, res : Response) => {
    const gid = req.params.id;

    try {
        const game = await Game.findById<GameDoc>(gid);
        res.json(game);
    }
    catch(e) {
        console.log('Error at GET /games/:id');
    }
}

export const getGameByName = async (req : Request, res : Response) => {
    const gameName = req.params.name;

    try {
        const game = await Game.findOne<GameDoc>({ name : gameName })
        res.json(game);
    }
    catch(e) {
        console.log('Error at GET /games/name/:name')
    }
}

export const createGame = async (req : Request, res : Response) => {

}

export const createGameMode = async (req : Request, res : Response) => {
    
}

export const getAllGameModeProfileStats = async (req : Request, res : Response) => {
    const game = req.params.name;
    const mode = req.params.mode;
    const pid = req.params.pid;

    try {
        const playerGMStats = await PlayerStats.find<PlayerStatsDoc>({ game : game, gameMode : mode, playerProfile : pid });
        res.json(playerGMStats);
    }
    catch(e) {
        
    }
}
