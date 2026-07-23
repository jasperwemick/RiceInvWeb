import express from "express";
import Profile from '../models/profileModel';

import { Verify, VerifyRole } from '../middleware/verify'

import multer from 'multer';
import sharp from 'sharp';

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createNewProfile, createNewProfileImage, deleteNewProfile, deleteProfileImage, getAllProfiles, getAllProfilesNoImage, getProfileById, patchProfileImage, updateNewProfile } from "../controllers/profileController";

const router = express.Router();

// Set up image storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

if (!process.env.ACCESS_KEY || !process.env.SECRET_KEY || !process.env.BUCKET_REGION) {
    throw new Error("Missing S3 bucket access info");
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.BUCKET_REGION
});

// Get all profiles
router.get('/default', getAllProfiles);

router.get('/default/noimg', getAllProfilesNoImage);

// Get a profile
router.get('/default/:id', getProfileById);

// Post a new profile
router.post('/default', Verify, VerifyRole, upload.single('image'), createNewProfile);

// Delete profile
router.delete('/default/:id', Verify, VerifyRole, deleteNewProfile);

router.patch('/default/:id', Verify, VerifyRole, upload.none(), updateNewProfile);

//##############################################################################################

// Post a new image for a profile
router.post('/default/images', Verify, VerifyRole, upload.single('image'), createNewProfileImage);

router.delete('/default/:id/images', Verify, VerifyRole, deleteProfileImage);

router.patch('/default/:id/images', Verify, VerifyRole, upload.single('image'), patchProfileImage);

//###########################################################################################################################

// router.get('/league', async (req, res) => {
//     try {
//         const leagueProfiles = await LeagueProfile.find();
//         res.json(leagueProfiles);
//     }
//     catch(e) {
//         console.log("Error at GET /league: ", e)
//     }

// })

// router.get('/league/:id', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const leagueProfile = await LeagueProfile.findOne({playerID: id});
//         res.json(leagueProfile);
//     }
//     catch(e) {
//         console.log("Error at GET /league/:pid: ", e)
//     }

// })

// router.get('/league/:pid/games', async (req, res) => {
//     const pid = req.params.pid;

//     try {
//         const leagueProfile = await LeagueProfile.findOne({playerID: pid});
//         if (!leagueProfile) {
//             throw new Error("Failed to get profile");
//         }
//         const games = await LeagueGame.find({gameNumber: leagueProfile.games});
//         res.json(games);
//     }
//     catch(e) {
//         console.log("Error at GET /league/:pid/games: ", e)
//     }
// })

// router.get('/league/:pid/games/stats', async (req, res) => {
//     const pid = req.params.pid;

//     try {
//         const stats = await LeagueGamePlayerStat.find({profileID: pid});
//         res.json(stats);
//     }
//     catch(e) {
//         console.log("Error at GET /league/:pid/games/stats: ", e)
//     }

// })

// router.get('/league/:pid/games/:gid/stats', async (req, res) => {
//     const pid = req.params.pid;
//     const gid = req.params.gid;

//     try {
//         const stat = await LeagueGamePlayerStat.findOne({profileID: pid, gameID: gid})
//         res.json(stat);
//     }
//     catch(e) {
//         console.log("Error at GET /league/:pid/games/:gid/stats: ", e)
//     }

// })

// // ########################################################################3

// router.get('/brawl', async (req, res) => {
//     try {
//         const brawlProfiles = await BrawlProfile.find();
//         res.json(brawlProfiles);
//     }
//     catch(e) {
//         console.log("Error at GET /brawl: ", e)
//     }

// })

// router.get('/brawl/:id', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const brawlProfile = await BrawlProfile.findOne({playerID: id});
//         res.json(brawlProfile);
//     }
//     catch(e) {
//         console.log("Error at GET /league/:id: ", e)
//     }

// })

// router.get('/brawl/:id/sets', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const brawlProfile = await BrawlProfile.findOne({playerID: id});
//         if (!brawlProfile) {
//             throw new Error("Failed to get profile");
//         }
//         const sets = await BrawlSet.find({setNumber: brawlProfile.sets});
//         res.json(sets);
//     }
//     catch(e) {
//         console.log("Error at GET /brawl/:id/sets: ", e)
//     }
// })

// router.get('/brawl/:id/sets/ones/stats', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const personalStats = await BrawlSetOnesStat.find({profileID: id});
//         let setList = personalStats.map(x => x.setID);
//         const allStats = await BrawlSetOnesStat.find({setID: setList});
//         res.json(allStats);
//     }
//     catch(e) {
//         console.log("Error at GET /brawl/:id/sets/ones/stats: ", e)
//     }

// })

// router.get('/brawl/:id/sets/twos/stats', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const personalStats = await BrawlSetTwosStat.find({profileID: id});
//         let setList = personalStats.map(x => x.setID);
//         const allStats = await BrawlSetTwosStat.find({setID: setList});
//         res.json(allStats);
//     }
//     catch(e) {
//         console.log("Error at GET /brawl/:id/sets/twos/stats: ", e)
//     }

// })

export default router