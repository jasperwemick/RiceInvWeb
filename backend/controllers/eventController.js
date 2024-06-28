const RiceEvent = require('../models/riceEventsModel')

const getRiceEvents = async (req, res) => {

    const ready = req.query.ready
    try {
        if (ready) {
            const events = await RiceEvent.find({ready: ready}).populate('participants.person').exec()
            res.json(events)
        }
        else {
            const events = await RiceEvent.find().populate('participants.person').exec()
            res.json(events)
        }
    }
    catch(e) {
        console.log('Error at GET /events', e)
    }
}

const getMonthlyRiceEvents = async (req, res) => {

    const year = req.params.year
    const month = req.params.month

    try {
        const events = await RiceEvent.find({year: year, month: month}).populate('participants.person').exec()
        res.json(events)
    }
    catch(e) {
        console.log('Error at GET /events/:year/:month', e)
    }
}

const getDailyRiceEvents = async (req, res) => {

    const year = req.params.year
    const month = req.params.month
    const day = req.params.day

    try {
        const events = await RiceEvent.find({year: year, month: month, day: day}).populate('participants.person').exec()
        res.json(events)
    }
    catch(e) {
        console.log('Error at GET /events/:year/:month/:day', e)
    }
}

const getOneRiceEvents = async (req, res) => {

    const year = req.params.year
    const month = req.params.month
    const day = req.params.day
    const tag = req.params.tag

    try {
        const event = await RiceEvent.find({year: year, month: month, day: day, tag: tag}).populate('participants.person').exec()
        res.json(event)
    }
    catch(e) {
        console.log('Error at GET /events/:year/:month/:day/:tag', e)
    }
}

const createRiceEvent = async (req, res) => {
    try {
        const post = await RiceEvent.create({
            ...req.body
        })
        const result = await post.save()

        res.json(result)
    }
    catch(e) {
        console.log('Error at POST /events', e)
    }
}

const upsertOneRiceEvent = async (req, res) => {

    const tag = req.params.tag

    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    try {
        console.log(req.body)
        const result = await RiceEvent.findOneAndUpdate({tag: tag}, {...req.body}, options)
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /events/:tag', e)
    }
}

const deleteOneRiceEvent = async (req, res) => {

    const tag = req.params.tag

    try {
        const result = await Set.findOneAndDelete({tag: tag})
        res.json(result)
    }
    catch(e) {
        console.log('Error at DELETE /events/:tag', e)
    }
}

module.exports = { getRiceEvents, getMonthlyRiceEvents, getDailyRiceEvents, getOneRiceEvents, createRiceEvent, upsertOneRiceEvent, deleteOneRiceEvent }