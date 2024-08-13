import { createContext, useState } from "react";

const EventContext = createContext({})

export const EventContextProvider = ({children}) => {

    const [events, setEvents] = useState([])
    const [currentEvent, setCurrentEvent] = useState({
        _id: '0',
        name: '',
        description: '',
        year: 0,
        month: 0,
        day: 0,
        group: '',
        duration: 0,
        timeRanges: [],
        participants: [],
        ready: false,
        finished: false
    })
    const [selectedDayEvents, setSelectedDayEvents] = useState([])

    const clearEvent = () => {
        setCurrentEvent({
            _id: '0',
            name: '',
            description: '',
            year: 0,
            month: 0,
            day: 0,
            group: '',
            duration: 0,
            timeRanges: [],
            participants: [],
            ready: false,
            finished: false
        })
    }

    return (
        <EventContext.Provider value={{events, setEvents, currentEvent, setCurrentEvent, selectedDayEvents, setSelectedDayEvents, clearEvent}}>
            {children}
        </EventContext.Provider>
    )
}

export default EventContext;