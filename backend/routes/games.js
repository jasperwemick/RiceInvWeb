const express = require('express')
const Profile = require('../models/profilesModel')
const LeagueGame = require('../models/leagueGamesModel')
const LeagueGamePlayerStat = require('../models/leagueGamePlayerStatsModel')
const profilesModel = require('../models/profilesModel')

const router = express.Router()


// Get all games
router.get('/league', async (req, res) => {
    
    try {
        const games = await LeagueGame.find();
        res.json(games);
    }
    catch(e) {
        console.log("Error at /league: ", e);
    }

})

router.get('/league/:gid', async (req, res) => {
    const gid = req.params.gid;

    try {
        const game = await LeagueGame.findById(gid);
        res.json(game);
    }
    catch(e) {
        console.log("Error at /league/:gid: ", e);
    }

})

router.get('/league/:gid/stats', async (req, res) => {
    const gid = req.params.gid;

    try {
        const statDatas = await LeagueGamePlayerStat.find({gameID: gid});
        res.json(statDatas);
    }
    catch(e) {
        console.log("Error at /league/:gid/stats: ", e);
    }
})

router.get('/league/:gid/profiles/names', async (req, res) => {
    const gid = req.params.gid;

    try {
        const stat = await LeagueGamePlayerStat.find({gameID: gid}, 'profileID -_id');
        const names = await Profile.find({_id: stat.map(item => item.profileID)}, 'name');
        res.json(names);
    }
    catch(e) {
        console.log("Error at /league/:gid/profiles/names: ", e);
    }

})

module.exports = router