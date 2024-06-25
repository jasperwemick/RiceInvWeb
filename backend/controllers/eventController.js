const RiceEvent = require('../models/riceEventsModel')

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
        const events = await RiceEvent.find({year: year, month: month, day: day}).populate('participants.person')
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
        const event = await RiceEvent.find({year: year, month: month, day: day, tag: tag}).populate('participants.person')
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

    const year = req.params.year
    const month = req.params.month
    const day = req.params.day
    const tag = req.params.tag

    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    try {
        const result = await Set.findOneAndUpdate({year: year, month: month, day: day, tag: tag}, {...req.body}, options)
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /events/:year/:month/:day/:tag', e)
    }
}

const deleteOneRiceEvent = async (req, res) => {

    const year = req.params.year
    const month = req.params.month
    const day = req.params.day
    const tag = req.params.tag


    try {
        const result = await Set.findOneAndDelete({year: year, month: month, day: day, tag: tag})
        res.json(result)
    }
    catch(e) {
        console.log('Error at DELETE /events/:year/:month/:day/:tag', e)
    }
}

module.exports = { getMonthlyRiceEvents, getDailyRiceEvents, getOneRiceEvents, createRiceEvent, upsertOneRiceEvent, deleteOneRiceEvent }