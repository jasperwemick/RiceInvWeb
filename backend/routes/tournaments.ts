import express, { Router } from "express";
import { createOneBracketSet, upsertOneBracketSet, deleteOneBracketSet, upsertManyBracketSets } from '../controllers/setController';
import { createTournament, getAllPlayerTournaments, getAllTournaments, getAllTournamentSets, getPlayerTournamentSets, getTournament, getTournamentsByGameId, getTournamentsByGameName } from "../controllers/tournamentController";

const router = Router();

router.post('/set', createOneBracketSet);

router.put('/set/:tag/:num', upsertOneBracketSet);

router.put('/set/:tag', upsertManyBracketSets);

router.delete('/set/:tag/:num', deleteOneBracketSet);

router.get('/', getAllTournaments)

router.get('//:tid', getTournament);

router.get('/game/:gid', getTournamentsByGameId);

router.get('/game/:name', getTournamentsByGameName);

router.get('/:tid/set', getAllTournamentSets);

router.get('/player/:pid', getAllPlayerTournaments);

router.get('/:tid/player/:pid/set', getPlayerTournamentSets);

router.post('/', createTournament);

export default router