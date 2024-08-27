import React, { useState, useEffect, useRef, useContext } from "react";
import GetUrl from "../../GetUrl"
import SchedulePopUpToggleContext from "./context/SchedulePopUpToggleProvider";
import EventContext from "./context/EventContextProvider";
import useAuth from "../../hooks/userAuth";


const EventItem = ({event, toggleEventInfo, setToggleEventInfo, setCurrentEvent, clearEvent, auth}) => {
    return (
        <li 
        onClick={() => {
            setToggleEventInfo(!toggleEventInfo);
            event ? setCurrentEvent({...event}) : clearEvent();
        }}
        style={event ? (event.ready ? {backgroundColor: "forestgreen"} : null) : 
            ((auth.user && (auth.roles ? auth.roles.includes('Admin') : false)) ? 
                null : {pointerEvents: 'none', visibility: 'hidden'})}>
            {event ? event.name : 'Add Event'}
        </li>
    )
}

// Pool of unresolved events
export const EventPool = ({}) => {

    const { toggleEventInfo, setToggleEventInfo } = useContext(SchedulePopUpToggleContext)

    const { setCurrentEvent, events, setEvents, clearEvent } = useContext(EventContext)

    const { auth }  = useAuth()

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
                    clearEvent={clearEvent}
                    auth={auth}/>
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
                clearEvent={clearEvent}
                auth={auth}/>
        </ul>
    )
}