import React, { useState, useEffect, useRef, useContext } from "react";
import GetUrl from "../../GetUrl"
import SchedulePopUpToggleContext from "./context/SchedulePopUpToggleProvider";
import EventContext from "./context/EventContextProvider";


const EventItem = ({event, toggleEventInfo, setToggleEventInfo, setCurrentEvent, clearEvent}) => {
    return (
        <li 
        onClick={() => {
            setToggleEventInfo(!toggleEventInfo);
            event ? setCurrentEvent({...event}) : clearEvent();
        }} 
        style={event ? (event.ready ? {backgroundColor: "forestgreen"} : null) : null}>
            {event ? event.name : 'Add Event'}
        </li>
    )
}

// Pool of unresolved events
export const EventPool = ({}) => {

    const { toggleEventInfo, setToggleEventInfo } = useContext(SchedulePopUpToggleContext)

    const { currentEvent, setCurrentEvent, events, setEvents, clearEvent } = useContext(EventContext)

    useEffect(() => {

        const getEvents = async () => {

            try {
                const response = await fetch(`${GetUrl}/api/events/ev`)
                const jsponse = await response.json()
                setEvents(jsponse)
            }
            catch(e) {
                console.log("no")
            }
        }

        getEvents()
    }, [toggleEventInfo])

    const mapEvents = () => {
        return events.map((ev, index) => {
            return (
                <EventItem 
                    key={index} 
                    event={ev} 
                    toggleEventInfo={toggleEventInfo} 
                    setToggleEventInfo={setToggleEventInfo}
                    setCurrentEvent={setCurrentEvent}
                    clearEvent={clearEvent}/>
            )
        })
    }

    return (
        <ul className="event-pool">
            {mapEvents()}
            <EventItem 
                event={null}
                toggleEventInfo={toggleEventInfo} 
                setToggleEventInfo={setToggleEventInfo}
                setCurrentEvent={setCurrentEvent}
                clearEvent={clearEvent}/>
        </ul>
    )
}