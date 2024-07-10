const RiceEvent = require('../models/riceEventsModel')
const TimeEntry = require('../models/timeEntryModel')

const AssessEventTimes = async () => {
    // Get the people (ids) involved in the event and all of their respective valid time entries
    const playerTimes = await this.model.find({profileId: {$in: ev.participants}})
    // console.log(playerTimes)

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
        if (dailyTimeRanges.length === ev.participants.length) {

            // Compare all time ranges and compress into a single unifed array
            let compressedTimeRange = []

            let countTrues = 0
            const durationThreshold = ev.duration * 2
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
    await RiceEvent.findByIdAndUpdate(ev._id, {
        $set: { timeRanges: evTimeRanges }, 
        ready: (evTimeRanges.length === 0 ? false : true),
        }
    )
}

module.exports = { AssessEventTimes }