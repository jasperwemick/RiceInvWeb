import React, { useState, useEffect } from "react";

import { TimeEntry } from "./TimeEntry"
import GetUrl from "../../GetUrl";

export const EventSchedule = ({eventData, setEventData, toggleEventInfo, setToggleEventInfo}) => {

    const [selectedRange, setSelectedRange] = useState(-1)

    const submitToCalendar = (range) => {
        setEventData({...eventData, month: range.month, day: range.day, year: range.year})

        const submission = {...eventData, month: range.month, day: range.day, year: range.year}

        const upsertEventData = async () => {

            try {
                await fetch(`${GetUrl}/api/events/ev/${eventData._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(submission)
                })
                setToggleEventInfo(!toggleEventInfo)
            }
            catch(e) {
                console.log(`Failed to fetch (PUT): ${e}`)
            }
        }

        upsertEventData()
    }

    // Todo: append next day's consolidated timerange to the current one being evaluated in order to consider cross-day possibilities
    const possibleStartTimesList = () => {

        const requiredIntervalNum = eventData.duration * 2

        let startTimeIndices = []
        if (selectedRange !== -1) {
            eventData.timeRanges[selectedRange].timeRange.forEach((interval, index, arr) => {

                let currentInterval = interval
                let consecutives = 0
                let i = index
                while (currentInterval) {
                    consecutives += 1
                    if (consecutives === requiredIntervalNum) {
                        startTimeIndices.push(index)
                        break
                    }
                    if (i === arr.length - 1) { break }
                    currentInterval = arr[++i]
                }
            })
        }

        const indexToTime = (index) => {
            let hour = String(Math.floor(index / 2) % 12)
            hour = hour.length === 1 ? '0' + hour : '' + hour 
            hour = hour === '00' ? '12' : hour
            const minutes = index % 2 == 0 ? '00' : '30'
            const mmm = Math.floor(index / 2) < 12 ? 'AM' : 'PM'
            return hour + ':' + minutes + ' ' + mmm
        }

        return startTimeIndices.map((timeIndex) => {
            return (
                <li>{indexToTime(timeIndex)}</li>
            )
        })

    }


    return (
        <div className='event-info-window'>
            <div style={{display: 'flex', alignItems: 'center', scale: '80%'}}>
                <button style={{width: 30, height: 30}}>{`<`}</button>
                <div className="event-time-entries-container">
                    {eventData.timeRanges.map((range, index) => {
                        return (
                            <div 
                            key={index} 
                            onClick={() => {submitToCalendar(range)}} 
                            onMouseEnter={() => setSelectedRange(index)} 
                            onMouseLeave={() => setSelectedRange(-1)}
                            >
                                <p className="no-select-text">{`Date: ${range.month}/${range.day}/${range.year}`}</p>
                                <TimeEntry timeInvervalData={range.timeRange} setTimeIntervalData={null}/>
                            </div>
                        )
                    })}
                </div>
                <button style={{width: 30, height: 30}}>{`>`}</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <p>{eventData.name}</p>
                <p>{`Duration: ${eventData.duration} Hours`}</p>
                <ul>{possibleStartTimesList()}</ul>
            </div>
        </div>
    )
}