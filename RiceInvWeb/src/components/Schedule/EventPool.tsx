import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from 'react';
import useAuth from "../../hooks/useAuth";
import type { RiceEvent, User } from "../../data/types";
import useRiceEvent from "./hooks/useRiceEvent";
import useSchedulePopUp from "./hooks/useSchedulePopUp";
import apiFetch from "../../util/fetch";

interface EventItem {
    event : RiceEvent | null;
    toggleEventInfo : boolean;
    setToggleEventInfo : Dispatch<SetStateAction<boolean>>;
    setCurrentEvent : Dispatch<SetStateAction<RiceEvent | null>>;
    clearEvent : () => void;
    auth : User | null;
}

function EventItem({event, toggleEventInfo, setToggleEventInfo, setCurrentEvent, clearEvent, auth} : EventItem) {
    return (
        <li 
        onClick={() => {
            setToggleEventInfo(!toggleEventInfo);
            event ? setCurrentEvent({...event}) : clearEvent();
        }}
        style={event ? (event.ready ? {backgroundColor: "forestgreen"} : undefined) : 
            ((auth?.username && (auth.roles ? auth.roles.includes('Admin') : false)) ? 
                undefined : {pointerEvents: 'none', visibility: 'hidden'})}>
            {event ? event.name : 'Add Event'}
        </li>
    )
}

// Pool of unresolved events
export default function EventPool() {

    const { toggleEventInfo, setToggleEventInfo } = useSchedulePopUp();
    const { setCurrentEvent, events, setEvents, clearEvent } = useRiceEvent()
    const { auth }  = useAuth()

    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [eventPool, setEventPool] = useState<RiceEvent[]>([])

    useEffect(() => {

        const getEvents = async () => {

            try {
                const unfinishedEvents = await apiFetch<RiceEvent[]>(`/api/events/ev?finished=false`);

                setEvents(unfinishedEvents);
                setEventPool(unfinishedEvents);
                setCategories([...new Set(unfinishedEvents.map(x => x.group))]);
            }
            catch(e) {
                console.log('Failed to fetch events');
            }
        }

        getEvents();
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
                style={selectedCategory === cat ? {backgroundColor: "#a6a6a6"} : undefined}>
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