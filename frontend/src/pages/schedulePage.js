import React, { useState, useEffect } from "react";
import { Calendar } from "../components/Schedule/Calendar";
import { TimeEditor } from "../components/Schedule/TimeEditor";
import { EventPool } from "../components/Schedule/EventPool";
import { EventInfo } from "../components/Schedule/EventInfo";

import '../style/schedule.css'


export default function SchedulePage({}) {

    const [toggleTimeEntry, setToggleTimeEntry] = useState(false)
    const [toggleEventInfo, setToggleEventInfo] = useState(false)

    const [events, setEvents] = useState([])

    const [entryDate, setEntryDate] = useState(new Date())
    const [currentEvent, setCurrentEvent] = useState({
        _id: '0',
        name: '',
        description: '',
        year: 0,
        month: 0,
        day: 0,
        group: '',
        duration: 0,
        timeRanges: [],
        participants: [],
        ready: false,
        finished: false
    })

    return (
        <div>
            <div className={`time-entry-window`} style={toggleTimeEntry ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                <TimeEditor 
                    date={entryDate} 
                    enabled={toggleTimeEntry} 
                    toggleSelf={setToggleTimeEntry}/>
            </div>
            <div className={`time-entry-window`} style={toggleEventInfo ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                <EventInfo 
                    toggleEventInfo={toggleEventInfo}
                    setToggleEventInfo={setToggleEventInfo} 
                    currentEvent={currentEvent} 
                    setCurrentEvent={setCurrentEvent}/>
            </div>
            <div style={{display: 'flex'}}>
                <Calendar 
                    timeToggle={setToggleTimeEntry} 
                    timeToggleStatus={toggleTimeEntry} 
                    setEntryDate={setEntryDate}
                    events={events}/>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>        
                    <p>{`EventPool`}</p>
                    <EventPool 
                        toggleEventInfo={toggleEventInfo} 
                        setToggleEventInfo={setToggleEventInfo}
                        setCurrentEvent={setCurrentEvent}
                        events={events}
                        setEvents={setEvents}/>
                </div>
            </div>
        </div>
    )
}