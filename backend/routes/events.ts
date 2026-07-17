const express = require('express')
import { Verify, VerifyRole } from '../middleware/verify';

// const multer = require('multer')

// // Set up image storage
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage})

import { getUserMonthTimeEntries, getMonthTimeEntriesWithBorderEntries, getUserTimeDateEntry, createTimeEntry, updateTimeEntry, deleteTimeEntry } from '../controllers/timeController';
import { getRiceEvents, getMonthlyRiceEvents, getDailyRiceEvents, getOneRiceEvents, createRiceEvent, upsertOneRiceEvent, deleteOneRiceEvent } from '../controllers/eventController';

// Time Entry

const router = express.Router()

router.get('/time/:user/:year/:month', getUserMonthTimeEntries)

router.get('/time/:user/:year/:month/borders', getMonthTimeEntriesWithBorderEntries)

router.get('/time/:user/:year/:month/:day', getUserTimeDateEntry)

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

export default router