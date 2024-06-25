const express = require('express')
const {Verify, VerifyRole} = require('../middleware/verify')

const router = express.Router()
// const multer = require('multer')

// // Set up image storage
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage})

const { getUserMonthTimeEntries, getUserTimeDateEntry, createTimeEntry, updateTimeEntry, deleteTimeEntry } = require('../controllers/timeController')
const { getMonthlyRiceEvents, getDailyRiceEvents, getOneRiceEvents, createRiceEvent, upsertOneRiceEvent, deleteOneRiceEvent } = require('../controllers/eventController')

// Time

router.get('/time/:user/:year/:month', getUserMonthTimeEntries)

router.get('/time/:user/:year/:month/:day', getUserTimeDateEntry)

router.post('/time', createTimeEntry)

router.put('/time/:user/:year/:month/:day', updateTimeEntry)

router.delete('/time/:user/:year/:month/:day', deleteTimeEntry)


//########################################################################################################

router.get('/ev/:year/:month', getMonthlyRiceEvents)

router.get('/ev/:year/:month/:day', getDailyRiceEvents)

router.get('/ev/:year/:month/:day/:tag', getOneRiceEvents)

router.post('/ev', createRiceEvent)

router.put('/ev/:year/:month/:day/:tag', upsertOneRiceEvent)

router.delete('/ev/:year/:month/:day/:tag', deleteOneRiceEvent)


module.exports = router