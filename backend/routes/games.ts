import express from 'express';
import { getGameById, getGameByName } from '../controllers/gameController';

const router = express.Router()

router.get('/:id', getGameById);

router.get('/name/:name', getGameByName);

export default router;