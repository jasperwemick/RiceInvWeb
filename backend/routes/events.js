const express = require('express')
const {Verify, VerifyRole} = require('../middleware/verify')

const router = express.Router()
// const multer = require('multer')

// // Set up image storage
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage})

const { getUserMonthTimeEntries, getMonthTimeEntriesWithBorderEntries, getUserTimeDateEntry, createTimeEntry, updateTimeEntry, deleteTimeEntry, getThreeDayTimeEntry } = require('../controllers/timeController')
const { getRiceEvents, getMonthlyRiceEvents, getDailyRiceEvents, getOneRiceEvents, createRiceEvent, upsertOneRiceEvent, deleteOneRiceEvent } = require('../controllers/eventController')

// Time Entry

router.get('/time/:user/:year/:month', getUserMonthTimeEntries)

router.get('/time/:user/:year/:month/borders', getMonthTimeEntriesWithBorderEntries)

router.get('/time/:user/:year/:month/:day', getUserTimeDateEntry)

router.get('/time/:user/:year/:month/:day/ext', getThreeDayTimeEntry)

router.post('/time', Verify, createTimeEntry)

router.put('/time/:user/:year/:month/:day', Verify, updateTimeEntry)

router.delete('/time/:user/:year/:month/:day', Verify, deleteTimeEntry)

// Events

router.get('/ev/:year/:month', getMonthlyRiceEvents)

router.get('/ev/:year/:month/:day', getDailyRiceEvents)

router.get('/ev/:year/:month/:day/:tag', getOneRiceEvents)

router.get('/ev', getRiceEvents)

router.post('/ev', Verify, VerifyRole, createRiceEvent)

router.put('/ev/:tag', Verify, VerifyRole, upsertOneRiceEvent)

router.delete('/ev/:tag', Verify, VerifyRole, deleteOneRiceEvent)

module.exports = router