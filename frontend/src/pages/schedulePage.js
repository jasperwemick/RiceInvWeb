import React, { useState, useEffect } from "react";
import GetUrl from "../GetUrl";
import { Calendar } from "../components/Schedule/Calendar";
import { TimeEditor } from "../components/Schedule/TimeEditor";
import { EventEditor } from "../components/Schedule/EventEditor";
import { EventPool } from "../components/Schedule/EventPool";


export default function SchedulePage() {

    const [toggleTimeEntry, setToggleTimeEntry] = useState(false)
    const [toggleEventEntry, setToggleEventEntry] = useState(false)

    const [entryDate, setEntryDate] = useState(new Date())

    return (
        <div>
            <div className={`time-entry-window`} style={toggleTimeEntry ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                <TimeEditor date={entryDate} enabled={toggleTimeEntry} toggleSelf={setToggleTimeEntry}/>
            </div>
            <div className={`time-entry-window`} style={toggleEventEntry ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                <EventEditor date={entryDate}/>
            </div>
            <div style={{display: 'flex'}}>
                <Calendar 
                    timeToggle={setToggleTimeEntry} 
                    timeToggleStatus={toggleTimeEntry} 
                    eventToggle={setToggleEventEntry}
                    eventToggleStatus={toggleEventEntry}
                    setEntryDate={setEntryDate}/>
                <EventPool/>
            </div>
        </div>
    )
}