const express = require('express')
const Profile = require('../models/profilesModel')
const LeagueGame = require('../models/leagueGamesModel')
const LeagueGamePlayerStat = require('../models/leagueGamePlayerStatsModel')
const BrawlSet = require('../models/brawlSetModel')
const brawlSetOnesStat = require('../models/brawlSetOnesStatsModel')
const brawlSetTwosStat = require('../models/brawlSetTwosStatsModel')
const Set = require('../models/setModel')
const { getBracketSets, getOneBracketSet, createOneBracketSet, upsertOneBracketSet, deleteOneBracketSet, upsertManyBracketSets } = require('../controllers/setController')

const router = express.Router()

router.get('/set/:tag', getBracketSets)

router.get('/set/:tag/:num', getOneBracketSet)

router.post('/set', createOneBracketSet)

router.put('/set/:tag/:num', upsertOneBracketSet)

router.put('/set/:tag', upsertManyBracketSets)

router.delete('/set/:tag/:num', deleteOneBracketSet)

// #################################################### LEAGUE OF LEGENDS ####################################################################
router.get('/league', async (req, res) => {
    
    try {
        const games = await LeagueGame.find();
        res.json(games);
    }
    catch(e) {
        console.log("Error at /league: ", e);
    }

})

router.get('/league/:num', async (req, res) => {
    const num = req.params.num;

    try {
        const game = await LeagueGame.findOne({gameNumber: num});
        res.json(game);
    }
    catch(e) {
        console.log("Error at /league/:num: ", e);
    }

})

router.get('/league/:num/stats', async (req, res) => {
    const num = req.params.num;

    try {
        const game = await LeagueGame.find({gameNumber: num});
        const statDatas = await LeagueGamePlayerStat.find({gameID: game.map(item => item._id)});
        res.json(statDatas);
    }
    catch(e) {
        console.log("Error at /league/:num/stats: ", e);
    }
})

router.get('/league/:num/profiles/names', async (req, res) => {
    const num = req.params.num;

    try {
        const game = await LeagueGame.find({gameNumber: num});
        const stat = await LeagueGamePlayerStat.find({gameID: game.map(item => item._id)}, 'profileID -_id');
        const names = await Profile.find({_id: stat.map(item => item.profileID)}, 'name');
        res.json(names);
    }
    catch(e) {
        console.log("Error at /league/:num/profiles/names: ", e);
    }

})

// ########################################### BRAWLHALLA ############################################################

router.get('/brawl', async (req, res) => {
    try {
        const games = await BrawlSet.find();
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl: ", e);
    }
})

router.get('/brawl/ones', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 1});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/ones: ", e);
    }
})

router.get('/brawl/ones/:value', async (req, res) => {

    const num = req.params.value
    console.log(num)

    try {
        const games = await BrawlSet.findOne({setNumber: num});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/ones/:value: ", e);
    }
})

router.put('/brawl/ones/:value', async (req, res) => {
    const num = req.params.value

    try {
    
        const result = await BrawlSet.updateOne({setNumber: num}, {
            formatType: req.body.formatType
        });
        res.json(result);
    }
    catch(e) {
        console.log("Error at PATCH /brawl/ones/:value: ", e)
    }
})

router.get('/brawl/ones/groups', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 1, formatType: 'Group'});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/ones/groups: ", e);
    }
})

router.get('/brawl/ones/gauntlet', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 1, formatType: 'Gauntlet'});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/ones/gauntlet: ", e);
    }
})

router.get('/brawl/ones/playoff', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 1, formatType: 'Playoff'});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/ones/playoff: ", e);
    }
})

router.get('/brawl/ones/stats', async (req, res) => {
    try {
        const stats = await brawlSetOnesStat.find();
        res.json(stats);
    }
    catch(e) {
        console.log("Error at /brawl/ones/stats: ", e);
    }
})

router.get('/brawl/twos', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 2});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/twos: ", e);
    }
})

router.get('/brawl/twos/groups', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 2, formatType: 'Group'});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/twos/groups: ", e);
    }
})

router.get('/brawl/twos/gauntlet', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 2, formatType: 'Gauntlet'});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/twos/gauntlet: ", e);
    }
})

router.get('/brawl/twos/playoff', async (req, res) => {
    try {
        const games = await BrawlSet.find({gameType: 2, formatType: 'Playoff'});
        res.json(games);
    }
    catch(e) {
        console.log("Error at /brawl/twos/playoff: ", e);
    }
})

router.get('/brawl/twos/stats', async (req, res) => {
    try {
        const stats = await brawlSetTwosStat.find();
        res.json(stats);
    }
    catch(e) {
        console.log("Error at /brawl/twos/stats: ", e);
    }
})

module.exports = router