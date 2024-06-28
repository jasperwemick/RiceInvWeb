import React, { useState, useEffect } from "react";
import { EventEditor } from "./EventEditor";
import { TimeEntry } from "./TimeEntry";

export const EventInfo = ({toggleEventInfo, setToggleEventInfo, currentEvent, setCurrentEvent}) => {

    const [eventView, setEventView] = useState('info')

    const [timeInvervalData, setTimeIntervalData] = useState(Array(48).fill(false))

    return (
        <div>
            <div style={eventView === 'info' ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                <p>{currentEvent.name}</p>
                <div className="event-time-entries-container">
                    {currentEvent.timeRanges.map((range, index) => {
                        return (
                            <TimeEntry key={index} timeInvervalData={range.timeRange} setTimeIntervalData={null}/>
                        )
                    })}
                </div>
            </div>
            <div style={eventView === 'editor' ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                <EventEditor eventData={currentEvent} setEventData={setCurrentEvent}/>
            </div>
            <button style={{width: 30, height: 30}} onClick={() => {setEventView(eventView === 'info' ? 'editor' : 'info')}}/>
            <button style={{width: 30, height: 30, backgroundColor: 'blue'}} onClick={() => {setToggleEventInfo(false)}}/>
        </div>
    )
}