const TimeEntry = require('../models/timeEntryModel')

const getUserMonthTimeEntries = async (req, res) => {
    const user = req.params.user
    const year = req.params.year
    const month = req.params.month

    console.log(user)

    try {
        const entries = await TimeEntry.find({user: user, year: year, month: month})
        res.json(entries)
    }
    catch(e) {
        console.log('Error at GET /time/:user/:year/:month')
    }

}

const getUserTimeDateEntry = async (req, res) => {

    const user = req.params.user
    const year = req.params.year
    const month = req.params.month
    const day = req.params.day

    try {
        const entry = await TimeEntry.findOne({user: user, year: year, month: month, day: day})
        res.json(entry)
    }
    catch(e) {
        console.log('Error at GET /time/:user/:year/:month/:day', e)
    }
}

const createTimeEntry = async (req, res) => {
    try {
        const post = await TimeEntry.create({
            ...req.body
        })
        const result = await post.save()

        res.json(result)
    }
    catch(e) {
        console.log('Error at POST /time', e)
    }
}

const updateTimeEntry = async (req, res) => {
    const user = req.params.user
    const year = req.params.year
    const month = req.params.month
    const day = req.params.day

    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    try {
        const result = await TimeEntry.findOneAndUpdate({user: user, year: year, month: month, day: day}, {...req.body}, options)
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /time/:user/:year/:month/:day', e)
    }
}

const deleteTimeEntry = async (req, res) => {
    const user = req.params.user
    const year = req.params.year
    const month = req.params.month
    const day = req.params.day
}

module.exports = { getUserMonthTimeEntries, getUserTimeDateEntry, createTimeEntry, updateTimeEntry, deleteTimeEntry }