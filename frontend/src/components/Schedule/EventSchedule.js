import React, { useState, useEffect } from "react";

import { TimeEntry } from "./TimeEntry"
import GetUrl from "../../GetUrl";

export const EventSchedule = ({eventData, setEventData, toggleEventInfo, setToggleEventInfo}) => {

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


    return (
        <div className='event-info-window'>
            <div style={{display: 'flex', alignItems: 'center', scale: '80%'}}>
                <button style={{width: 30, height: 30}}>{`<`}</button>
                <div className="event-time-entries-container">
                    {eventData.timeRanges.map((range, index) => {
                        return (
                            <div key={index} onClick={() => {submitToCalendar(range)}}>
                                <p className="no-select-text">{`Date: ${range.month}/${range.day}/${range.year}`}</p>
                                <TimeEntry timeInvervalData={range.timeRange} setTimeIntervalData={null}/>
                            </div>
                        )
                    })}
                </div>
                <button style={{width: 30, height: 30}}>{`>`}</button>
            </div>
            <div>
                <p>{eventData.name}</p>
                <p>{eventData.description}</p>
            </div>
        </div>
    )
}