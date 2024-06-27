import React, { useState, useEffect, useRef } from "react";
import GetUrl from "../../GetUrl"

// Pool of unresolved events
export const EventPool = ({}) => {

    const [events, setEvents] = useState([])

    useEffect(() => {

        const getEvents = async () => {

            try {
                const response = await fetch(`${GetUrl}/api/events/ev?ready=false`)
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
                <div key={index}>{ev.name}</div>
            )
        })
    }

    return (
        <div style={{width: 300, height: 300}}>{mapEvents()}</div>
    )
}