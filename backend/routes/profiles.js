const express = require('express')
const Profile = require('../models/profilesModel')
const router = express.Router()


// Get all job posting
router.get('/', async (req, res) => {
    try {
        const result = await Profile.find().exec();
        res.json(result);
    } catch (err) {
        res.json({error: err.message}).status(400);
    }
})

// Get a single job posting
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Profile.findById({_id: id});
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// POST job posting
router.post('/', async (req, res) => {
    try {
        const jobp = await Profile.create({ ...req.body });
        const result = await jobp.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// Delete job posting
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Profile.findByIdAndDelete({_id: id});
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

// PATCH job posting
router.patch('/:id', async (req, res) => {
    res.json({msg: 'PATCH new job posting'})
})

module.exports = router