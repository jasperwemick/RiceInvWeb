import React, { useState, useEffect, createContext, useContext } from "react";
import { Calendar } from "./Calendar";
import TimeEditor from "./TimeEditor";
import EventPool from "./EventPool";
import EventInfo from "./EventInfo";

import { SchedulePopUpToggleProvider } from "./context/SchedulePopUpToggleProvider";
import { EventContextProvider } from "./context/RiceEventContextProvider";
import { DayOverview } from "./DayOverview";

import './style/schedule.css'
import { TimeOverview } from "./TimeOverview";


export default function SchedulePage() {

    const [entryDate, setEntryDate] = useState<Date>(new Date())

    return (
            <div>
                <SchedulePopUpToggleProvider>
                <EventContextProvider>
                    <TimeEditor date={entryDate}/>
                    <EventInfo />
                    <TimeOverview date={entryDate}/>
                    <DayOverview date={entryDate}/>
                    <div style={{display: 'flex'}}>
                        <Calendar setEntryDate={setEntryDate}/>
                        <EventPool />
                    </div>
                </EventContextProvider>
                </SchedulePopUpToggleProvider>
            </div>
    )
}