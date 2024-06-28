import React, { useState, useEffect, useRef } from "react";
import GetUrl from "../../GetUrl"


const EventItem = ({event, toggleEventInfo, setToggleEventInfo, setCurrentEvent}) => {
    return (
        <li onClick={() => {
            setToggleEventInfo(!toggleEventInfo);
            if (event) { setCurrentEvent({...event}) };
        }} 
            style={event ? (event.ready ? {backgroundColor: "forestgreen"} : null) : null}>{event ? event.name : 'Add Event'}</li>
    )
}

// Pool of unresolved events
export const EventPool = ({toggleEventInfo, setToggleEventInfo, setCurrentEvent}) => {

    const [events, setEvents] = useState([])

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
    }, [])

    const mapEvents = () => {
        return events.map((ev, index) => {
            return (
                <EventItem 
                    key={index} 
                    event={ev} 
                    toggleEventInfo={toggleEventInfo} 
                    setToggleEventInfo={setToggleEventInfo}
                    setCurrentEvent={setCurrentEvent}/>
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
                setCurrentEvent={setCurrentEvent}/>
        </ul>
    )
}