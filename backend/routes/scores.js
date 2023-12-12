// const express = require('express')
// const Score = require('../models/scoresModel')

// const router = express.Router()

// // Get all score groups
// router.get('/scores', async (req, res) => {
//     const profiles = await Score.find()
//     res.json(profiles)
// })

// // Get a score group
// router.get('/:id/scores', async (req, res) => {
//     const id = req.params.id;
//     const profile = await Score.findById(id);
//     res.json(profile);
// })

// // Post a new score group
// router.post('/scores', async (req, res) => {
//     const post = await Score.create({ ...req.body });
//     const result = await post.save();
//     res.json(result);
// })

// // Delete scores
// router.delete('/:id/scores', async (req, res) => {
//     const id = req.params.id;

//     const scores = await Score.findById(id);

//     const response = await Score.deleteOne(scores);
//     res.json(response);
// })

// // Edit scores
// router.patch('/:id/scores', async (req, res) => {
//     const id = req.params.id;

//     const score = await Score.findById(id);
//     const result = await Score.updateOne(score, { ...req.body });

//     res.json(result);

// })