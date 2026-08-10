import express from 'express';
import { getAllGameModeProfileStats, getAllGames, getGameById, getGameByName } from '../controllers/gameController';

const router = express.Router()

router.get('/', getAllGames);

router.get('/:id', getGameById);

router.get('/name/:name', getGameByName);

router.get('/name/:name/mode/:mode/stats/player/:pid', getAllGameModeProfileStats);

export default router;