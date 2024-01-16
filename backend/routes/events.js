const express = require('express')
const RiceEvent = require('../models/riceEventsModel')
const {Verify, VerifyRole} = require('../middleware/verify')

const router = express.Router()
const multer = require('multer')

// Set up image storage
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})


// #################################################### LEAGUE OF LEGENDS ####################################################################
router.get('/', async (req, res) => {
    
    try {
        const events = await RiceEvent.find();
        res.json(events);
    }
    catch(e) {
        console.log("Error at GET /: ", e);
    }
})

router.get('/current', async (req, res) => {

    const month = Number(req.query.month) + 1;
    const year = Number(req.query.year);
    try {
        const events = await RiceEvent.find({month: month, year: year});
        res.json(events);
    }
    catch(e) {
        console.log("Error at GET /: ", e);
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const event = await RiceEvent.findById(id);
        res.json(event);
    }
    catch(e) {
        console.log("Error at GET /:id: ", e);
    }
})

router.post('/', upload.none(), Verify, VerifyRole, async (req, res) => {
    try {
        const post = await RiceEvent.create({ ...req.body });
        const result = await post.save();
        res.json(result);
    }
    catch(e) {
        console.log("Error at POST /:id: ", e);
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletion = await RiceEvent.findByIdAndDelete(id);
        res.json(deletion);
    }
    catch(e) {
        console.log("Error at DELETE /:id: ", e);
    }
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const update = await RiceEvent.findByIdAndUpdate(id, { ...req.body });
        const result = await update.save();
        res.json(result);
    }
    catch(e) {
        console.log("Error at UPDATE /:id: ", e);
    }
})

module.exports = router