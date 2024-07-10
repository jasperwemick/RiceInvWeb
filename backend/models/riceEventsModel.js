const mongoose = require('mongoose')

const Schema = mongoose.Schema

const riceEventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: Number,
    },
    month: {
        type: Number,
    },
    day: {
        type: Number,
    },
    group: {
        type: String,
        required: true 
    },
    duration: {
        type: Number,
        required: true
    },
    timeRanges: [{
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        timeRange: [{
            type: Boolean,
            required: true
        }],
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }],
    ready: {
        type: Boolean,
        required: true
    },
    finished: {
        type: Boolean,
        required: true
    },
}, { timestamps: true })

riceEventSchema.post('findOneAndUpdate', async function (doc, next) {

    // Prevent infinite looping of hooks between timEntryModel and this 
    if (this.getOptions().upsert) {

        try {

            // Find the events involving the player whos time was just updated
            const thisEventDoc = await this.model.findOne(this.getQuery())

            // Get the people (ids) involved in the event and all of their respective valid time entries
            const playerTimes = await doc.model('TimeEntry').find({profileId: {$in: thisEventDoc.participants}}).exec()

            const now = new Date()

            let evTimeRanges = []

            // Check the next two weeks
            for (let i = 0; i < 14; i++) {

                // Get relevant time ranges for the current selected date
                const dailyTimeRanges = playerTimes.filter((timeEntry) => (
                    timeEntry.year === now.getFullYear() && 
                    timeEntry.month === now.getMonth() + 1 && 
                    timeEntry.day === now.getDate())
                ).map(x => x.timeRange)

                // Check that there is a time entry for all participants
                if (dailyTimeRanges.length === thisEventDoc.participants.length) {

                    // Compare all time ranges and compress into a single unifed array
                    let compressedTimeRange = []

                    let countTrues = 0
                    const durationThreshold = thisEventDoc.duration * 2
                    let validDate = false

                    for (let halfHourIndex = 0; halfHourIndex < 48; halfHourIndex++) {
        
                        let halfHourDecision = true
                    
                        dailyTimeRanges.forEach((entry) => {
                            halfHourDecision &&= entry[halfHourIndex]
                        })
                        compressedTimeRange.push(halfHourDecision)

                        if (halfHourDecision) {
                            countTrues++
                        }
                        else {
                            countTrues = 0
                        }

                        if (countTrues >= durationThreshold) {
                            validDate = true
                        }
                    }
                    
                    // Push time range to compilation if valid
                    if (validDate) {
                        evTimeRanges.push({
                            year: now.getFullYear(),
                            month: now.getMonth() + 1,
                            day: now.getDate(),
                            timeRange: compressedTimeRange
                        })
                    }
                }

                now.setDate(now.getDate() + 1)
            }

            // PUT time ranges 
            await this.model.findOneAndUpdate(this.getQuery(), {
                $set: { timeRanges: evTimeRanges }, 
                ready: (evTimeRanges.length === 0 ? false : true),
            }
        )
        }
        catch(e) {
            console.log("blalalf", e)
        }
    }
}) 

module.exports = mongoose.model('RiceEvent', riceEventSchema)