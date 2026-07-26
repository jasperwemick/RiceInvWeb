import { Request, Response } from "express";
import Game, { GameDoc } from "../models/gameModel";


export const getGameByName = async (req : Request, res : Response) => {
    const gameName = req.params.name;

    try {
        const game = await Game.findOne<GameDoc>({ name : gameName })
        res.json(game);
    }
    catch(e) {
        console.log('Error at GET /game/:name')
    }
}

export const createGame = async (req : Request, res : Response) => {

}

export const createGameMode = async (req : Request, res : Response) => {
    
}