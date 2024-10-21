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

    const [categories, setCategories] = useState([])

    const [selectedCategory, setSelectedCategory] = useState('')

    const [eventPool, setEventPool] = useState([])

    useEffect(() => {

        const getEvents = async () => {

            try {
                const response = await fetch(`${GetUrl}/api/events/ev?finished=false`)
                const jsponse = await response.json()
                setEvents(jsponse)
                setEventPool(jsponse)

                setCategories([...new Set(jsponse.map(x => x.group))])
            }
            catch(e) {
                console.log("no")
            }
        }

        getEvents()
    }, [toggleEventInfo])

    const mapEvents = () => {
        return eventPool.map((ev, index) => {
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

    const mapCategories = () => {
        return categories.map((cat, index) => {
            return (
                <li onClick={() => {

                    if (selectedCategory === cat) {
                        setEventPool(events)
                        setSelectedCategory('')
                    }
                    else {
                        setEventPool(eventPool.filter(x => x.group === cat))
                        setSelectedCategory(cat)
                    }
                }}
                key={index}
                style={selectedCategory === cat ? {backgroundColor: "#a6a6a6"} : null}>
                    {cat}
                </li>
            )
        })
    }

    return (
        <div style={{display:'flex'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>        
                <p>{`EventPool`}</p>
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
            </div>
            <div>
                <p style={{textAlign: `center`}}>{`Event Filter`}</p>
                <ul className="event-pool-category-list">
                    {mapCategories()}
                </ul>
            </div>
        </div>
    )
}