import express, { Router } from "express";
import { createOneBracketSet, upsertOneBracketSet, deleteOneBracketSet, upsertManyBracketSets } from '../controllers/setController';
import { createTournament, getAllPlayerTournaments, getAllTournamentSets, getPlayerTournamentSets, getTournament, getTournamentsByGameId, getTournamentsByGameName } from "../controllers/tournamentController";

const router = Router();

router.post('/set', createOneBracketSet);

router.put('/set/:tag/:num', upsertOneBracketSet);

router.put('/set/:tag', upsertManyBracketSets);

router.delete('/set/:tag/:num', deleteOneBracketSet);

router.get('/tournament/:tid', getTournament);

router.get('/tournament/game/:gid', getTournamentsByGameId);

router.get('/tournament/game/:name', getTournamentsByGameName);

router.get('/tournament/:tid/set', getAllTournamentSets);

router.get('/tournament/player/:pid', getAllPlayerTournaments);

router.get('/tournament/:tid/player/:pid/set', getPlayerTournamentSets);

router.post('/tournament', createTournament);

export default router