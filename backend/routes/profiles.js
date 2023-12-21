const express = require('express')
const Profile = require('../models/profilesModel')
const LeagueProfile = require('../models/leagueProfilesModel')
const LeagueGame = require('../models/leagueGamesModel')
const LeagueGamePlayerStat = require('../models/leagueGamePlayerStatsModel')
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
router.get('/', async (req, res) => {

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

// Get a profile
router.get('/:id', async (req, res) => {
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
router.post('/', upload.single('image'), async (req, res) => {

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
router.delete('/:id', async (req, res) => {
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

router.patch('/:id', upload.none(), async (req, res) => {
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

router.get('/:id/images', async (req, res) => {
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
router.post('/images', upload.single('image'), async (req, res) => {
    
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

router.delete('/:id/images', async (req, res) => {
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

router.patch('/:id/images', upload.single('image'), async (req, res) => {
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

module.exports = router