const TimeEntry = require('../models/timeEntryModel')

const getUserMonthTimeEntries = async (req, res) => {
    const user = req.params.user
    const year = req.params.year
    const month = req.params.month

    try {
        const entries = await TimeEntry.find({user: user, year: year, month: month})
        res.json(entries)
    }
    catch(e) {
        console.log('Error at GET /time/:user/:year/:month')
    }

}

const getMonthTimeEntriesWithBorderEntries = async (req, res) => {
    const user = req.params.user
    const year = req.params.year
    const month = req.params.month

    const prevMonth = month === 0 ? 11 : month - 1
    const nextMonth = month === 11 ? 0 : month + 1

    const prevMonthLastDay = new Date(year, prevMonth + 1, 0);
    const nextMonthLastDay = new Date(year, nextMonth + 1, 0);

    try {
        let entries = await TimeEntry.find({user: user, year: year, month: month})
        const prevBorderEntry = await TimeEntry.findOne({user: user, year: year, month: prevMonth, day: prevMonthLastDay.getDate()})
        if (prevBorderEntry) entries.push(prevBorderEntry)

        const nextBorderEntry = await TimeEntry.findOne({user: user, year: year, month: nextMonth, day: nextMonthLastDay.getDate()})
        if (nextBorderEntry) entries.push(nextBorderEntry)

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

const getThreeDayTimeEntry = async (req, res) => {
    const user = req.params.user
    const year = req.params.year
    const month = req.params.month
    const day = req.params.day

    const date = new Date(year, month - 1, day)
    const prevDate = new Date(new Date(date).setDate(date.getDate() - 1))
    const nextDate = new Date(new Date(date).setDate(date.getDate() + 1))

    try {
        const entries = await TimeEntry.find({user: user, year: year, month: month, day: {$in: [prevDate.getDate(), day, nextDate.getDate()]}})
        res.json(entries)
    }
    catch(e) {
        console.log('Error at GET /time/:user/:year/:month/:day/ext', e)
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

module.exports = { getUserMonthTimeEntries, getMonthTimeEntriesWithBorderEntries, getUserTimeDateEntry, getThreeDayTimeEntry, 
    createTimeEntry, updateTimeEntry, deleteTimeEntry }