import React, { useState, useEffect } from "react";
import GetUrl from "../GetUrl";
import { Calendar } from "../components/Calendar";
import { TimeEditor } from "../components/TimeEditor";
import { EventEditor } from "../components/EventEditor";


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
            <Calendar 
                timeToggle={setToggleTimeEntry} 
                timeToggleStatus={toggleTimeEntry} 
                eventToggle={setToggleEventEntry}
                eventToggleStatus={toggleEventEntry}
                setEntryDate={setEntryDate}/>
        </div>
    )
}