import React, { useState, useEffect, createContext, useContext } from "react";
import { Calendar } from "./Calendar";
import { TimeEditor } from "./TimeEditor";
import { EventPool } from "./EventPool";
import { EventInfo } from "./EventInfo";

import { SchedulePopUpToggleProvider } from "./context/SchedulePopUpToggleProvider";
import { EventContextProvider } from "./context/EventContextProvider";
import { DayOverview } from "./DayOverview";

import './style/schedule.css'


export default function SchedulePage({}) {

    const [entryDate, setEntryDate] = useState(new Date())

    return (
            <div>
                <SchedulePopUpToggleProvider>
                <EventContextProvider>
                    <TimeEditor date={entryDate}/>
                    <EventInfo />
                    <DayOverview date={entryDate}/>
                    <div style={{display: 'flex'}}>
                        <Calendar setEntryDate={setEntryDate}/>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>        
                            <p>{`EventPool`}</p>
                            <EventPool />
                        </div>
                    </div>
                </EventContextProvider>
                </SchedulePopUpToggleProvider>
            </div>
    )
}