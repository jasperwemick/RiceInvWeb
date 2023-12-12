const express = require('express')
const Profile = require('../models/profilesModel')
const Score = require('../models/scoresModel')
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
})

// Get a profile
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const profile = await Profile.findById(id);
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: profile.imageName,
    }

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 600 })

    profile.imageUrl = url

    res.json(profile);
})

// Post a new profile
router.post('/', upload.single('image'), async (req, res) => {

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
        ricePoints: req.body.ricePoints
    });
    const result = await post.save();

    res.json(result);
})

// Delete profile
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const profile = await Profile.findById(id);

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: profile.imageName
    }

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    const response = await Profile.deleteOne(profile);
    res.json(response);
})

router.patch('/:id', upload.none(), async (req, res) => {
    const id = req.params.id;

    const profile = await Profile.findById(id);
    console.log(profile);
    console.log(req.body);
    const result = await Profile.updateOne(profile, {
        name: req.body.name,
        description: req.body.description,
        ricePoints: req.body.ricePoints
    });


    res.json(result);

})

//##############################################################################################

router.get('/:id/images', async (req, res) => {
    const id = req.params.id;
    const profile = await Profile.findById(id);
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: profile.imageName,
    }

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 600 })

    profile.imageUrl = url

    res.json(profile);
})

// Post a new image for a profile
router.post('/images', upload.single('image'), async (req, res) => {
    
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
})

router.delete('/:id/images', async (req, res) => {
    const id = req.params.id;

    const profile = await Profile.findById(id);

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: profile.imageName
    }

    const command = new DeleteObjectCommand(params);
    const response = await s3.send(command);

    res.json(response);
})

router.patch('/:id/images', upload.single('image'), async (req, res) => {
    const id = req.params.id;

    const profile = await Profile.findById(id);

    const result = await Profile.updateOne(profile, {
        imageName: req.file.originalname
    })

    res.json(result);
})

// #################################################################################################

// Get all score groups
router.get('/scores', async (req, res) => {
    const profiles = await Score.find()
    res.json(profiles)
})

// Get a score group
router.get('/:id/scores', async (req, res) => {
    const id = req.params.id;
    const profile = await Score.findById(id);
    res.json(profile);
})

// Post a new score group
router.post('/scores', upload.none(), async (req, res) => {
    const post = await Score.create({ ...req.body });
    const result = await post.save();
    res.json(result);
})

// Delete scores
router.delete('/:id/scores', async (req, res) => {
    const id = req.params.id;

    const scores = await Score.findById(id);

    const response = await Score.deleteOne(scores);
    res.json(response);
})

// Edit scores
router.patch('/:id/scores', upload.none(), async (req, res) => {
    const id = req.params.id;

    const score = await Score.findById(id);
    const result = await Score.updateOne(score, { ...req.body });

    res.json(result);

})

module.exports = router