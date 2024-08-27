const express = require('express')
const Profile = require('../models/profilesModel')

const LeagueProfile = require('../models/leagueProfilesModel')
const LeagueGame = require('../models/leagueGamesModel')
const LeagueGamePlayerStat = require('../models/leagueGamePlayerStatsModel')

const BrawlProfile = require('../models/brawlProfilesModel')
const BrawlSet = require('../models/brawlSetModel')
const BrawlSetOnesStat = require('../models/brawlSetOnesStatsModel')
const BrawlSetTwosStat = require('../models/brawlSetTwosStatsModel')

const { Verify, VerifyRole } = require('../middleware/verify')

const multer = require('multer')
const sharp = require('sharp')

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const router = express.Router()

// Set up image storage
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.BUCKET_REGION
});

// Get all profiles
router.get('/default', async (req, res) => {

    try {
        const profiles = await Profile.find()

        for (let profile of profiles) {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: profile.imageName,
            }
            const command = new GetObjectCommand(params)
            const url = await getSignedUrl(s3, command, { expiresIn: 600 })
    
            profile.imageUrl = url
        }
        
        res.json(profiles)
    }
    catch(e) {
        console.log("Error at GET /: ", e)
    }

})

router.get('/default/noimg', async (req, res) => {

    try {
        const profiles = await Profile.find()
        res.json(profiles)
    }
    catch(e) {
        console.log("Error at GET /default/noimg: ", e)
    }

})

// Get a profile
router.get('/default/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName,
        }
    
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 600 })
    
        profile.imageUrl = url
    
        res.json(profile);
    }
    catch(e) {
        console.log("Error at GET /:id: ", e)
    }

})

// Post a new profile
router.post('/default', Verify, VerifyRole, upload.single('image'), async (req, res) => {

    try {
        const buffer = await sharp(req.file.buffer).resize({height: 500, width: 400, fit: "contain"}).toBuffer();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: req.file.originalname,
            Body: buffer,
            ContentType: req.file.mimetype
        }
    
        const command = new PutObjectCommand(params);
        await s3.send(command);
    
        const post = await Profile.create({
            name: req.body.name,
            description: req.body.description,
            imageName: req.file.originalname,
            ricePoints: req.body.ricePoints,
            brawlPoints: req.body.brawlPoints,
            leaguePoints: req.body.leaguePoints,
            valPoints: req.body.valPoints,
            bullPoints: req.body.bullPoints,
            rocketPoints: req.body.rocketPoints,
            mysteryPoints: req.body.mysteryPoints,
            counterPoints: req.body.counterPoints,
            bonusPoints: req.body.bonusPoints
        });
        const result = await post.save();
    
        res.json(result);
    }
    catch(e) {
        console.log("Error at POST /: ", e)
    }

})

// Delete profile
router.delete('/default/:id', Verify, VerifyRole, async (req, res) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName
        }
    
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    
        const response = await Profile.deleteOne(profile);
        res.json(response);
    }
    catch(e) {
        console.log("Error at DELETE /:id: ", e)
    }

})

router.patch('/default/:id', Verify, VerifyRole, upload.none(), async (req, res) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);
        console.log(req.body);
    
        const result = await Profile.updateOne(profile, {
            ...req.body
        });
    
        res.json(result);
    }
    catch(e) {
        console.log("Error at PATCH /:id: ", e)
    }


})

//##############################################################################################

router.get('/default/:id/images', async (req, res) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName,
        }
    
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 600 })
    
        profile.imageUrl = url
    
        res.json(profile);
    }
    catch(e) {
        console.log("Error at GET /:id/images: ", e)
    }

})

// Post a new image for a profile
router.post('/default/images', Verify, VerifyRole, upload.single('image'), async (req, res) => {
    
    try {
        const buffer = await sharp(req.file.buffer).resize({height: 500, width: 400, fit: "contain"}).toBuffer();
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: req.file.originalname,
            Body: buffer,
            ContentType: req.file.mimetype
        }
    
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
    
        res.json(response);
    }
    catch(e) {
        console.log("Error at POST /images: ", e)
    }

})

router.delete('/default/:id/images', Verify, VerifyRole, async (req, res) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: profile.imageName
        }
    
        const command = new DeleteObjectCommand(params);
        const response = await s3.send(command);
    
        res.json(response);
    }
    catch(e) {
        console.log("Error at DELETE /:id/images: ", e)
    }

})

router.patch('/default/:id/images', Verify, VerifyRole, upload.single('image'), async (req, res) => {
    const id = req.params.id;

    try {
        const profile = await Profile.findById(id);
        const result = await Profile.updateOne(profile, {
            imageName: req.file.originalname
        })
        res.json(result);
    }
    catch(e) {
        console.log("Error at PATCH /:id/images: ", e)
    }

})

//###########################################################################################################################

router.get('/league', async (req, res) => {
    try {
        const leagueProfiles = await LeagueProfile.find();
        res.json(leagueProfiles);
    }
    catch(e) {
        console.log("Error at GET /league: ", e)
    }

})

router.get('/league/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const leagueProfile = await LeagueProfile.findOne({playerID: id});
        res.json(leagueProfile);
    }
    catch(e) {
        console.log("Error at GET /league/:pid: ", e)
    }

})

router.get('/league/:pid/games', async (req, res) => {
    const pid = req.params.pid;

    try {
        const leagueProfile = await LeagueProfile.findOne({playerID: pid});
        const games = await LeagueGame.find({gameNumber: leagueProfile.games});
        res.json(games);
    }
    catch(e) {
        console.log("Error at GET /league/:pid/games: ", e)
    }
})

router.get('/league/:pid/games/stats', async (req, res) => {
    const pid = req.params.pid;

    try {
        const stats = await LeagueGamePlayerStat.find({profileID: pid});
        res.json(stats);
    }
    catch(e) {
        console.log("Error at GET /league/:pid/games/stats: ", e)
    }

})

router.get('/league/:pid/games/:gid/stats', async (req, res) => {
    const pid = req.params.pid;
    const gid = req.params.gid;

    try {
        const stat = await LeagueGamePlayerStat.findOne({profileID: pid, gameID: gid})
        res.json(stat);
    }
    catch(e) {
        console.log("Error at GET /league/:pid/games/:gid/stats: ", e)
    }

})

// ########################################################################3

router.get('/brawl', async (req, res) => {
    try {
        const brawlProfiles = await BrawlProfile.find();
        res.json(brawlProfiles);
    }
    catch(e) {
        console.log("Error at GET /brawl: ", e)
    }

})

router.get('/brawl/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const brawlProfile = await BrawlProfile.findOne({playerID: id});
        res.json(brawlProfile);
    }
    catch(e) {
        console.log("Error at GET /league/:id: ", e)
    }

})

router.get('/brawl/:id/sets', async (req, res) => {
    const id = req.params.id;

    try {
        const brawlProfile = await BrawlProfile.findOne({playerID: id});
        const sets = await BrawlSet.find({setNumber: brawlProfile.sets});
        res.json(sets);
    }
    catch(e) {
        console.log("Error at GET /brawl/:id/sets: ", e)
    }
})

router.get('/brawl/:id/sets/ones/stats', async (req, res) => {
    const id = req.params.id;

    try {
        const personalStats = await BrawlSetOnesStat.find({profileID: id});
        let setList = personalStats.map(x => x.setID);
        const allStats = await BrawlSetOnesStat.find({setID: setList});
        res.json(allStats);
    }
    catch(e) {
        console.log("Error at GET /brawl/:id/sets/ones/stats: ", e)
    }

})

router.get('/brawl/:id/sets/twos/stats', async (req, res) => {
    const id = req.params.id;

    try {
        const personalStats = await BrawlSetTwosStat.find({profileID: id});
        let setList = personalStats.map(x => x.setID);
        const allStats = await BrawlSetTwosStat.find({setID: setList});
        res.json(allStats);
    }
    catch(e) {
        console.log("Error at GET /brawl/:id/sets/twos/stats: ", e)
    }

})

module.exports = router