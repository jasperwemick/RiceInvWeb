import React, { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RiceEvent } from "../../../data/types";

export interface EventContextType {
    events : RiceEvent[];
    setEvents : Dispatch<SetStateAction<RiceEvent[]>>;
    currentEvent : RiceEvent | null;
    setCurrentEvent : Dispatch<SetStateAction<RiceEvent | null>>;
    selectedDayEvents : RiceEvent[];
    setSelectedDayEvents : Dispatch<SetStateAction<RiceEvent[]>>;
    clearEvent : () => void;
}

const RiceEventContext = createContext<EventContextType | null>(null)

export const EventContextProvider = ({children} : { children : React.ReactNode }) => {

    const [events, setEvents] = useState<RiceEvent[]>([])
    const [currentEvent, setCurrentEvent] = useState<RiceEvent | null>(null)
    const [selectedDayEvents, setSelectedDayEvents] = useState<RiceEvent[]>([])

    const clearEvent = () => {
        setCurrentEvent(null)
    }

    return (
        <RiceEventContext.Provider value={{events, setEvents, currentEvent, setCurrentEvent, selectedDayEvents, setSelectedDayEvents, clearEvent}}>
            {children}
        </RiceEventContext.Provider>
    )
}

export default RiceEventContext;