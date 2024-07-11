import { createContext, useState } from "react";

const SchedulePopUpToggleContext = createContext({})

export const SchedulePopUpToggleProvider = ({children}) => {

    const [toggleTimeEntry, setToggleTimeEntry] = useState(false)
    const [toggleEventInfo, setToggleEventInfo] = useState(false)
    const [toggleDayOverview, setToggleDayOverview] = useState(false)

    return (
        <SchedulePopUpToggleContext.Provider value={{toggleTimeEntry, setToggleTimeEntry, toggleEventInfo, setToggleEventInfo, toggleDayOverview, setToggleDayOverview}}>
            {children}
        </SchedulePopUpToggleContext.Provider>
    )
}

export default SchedulePopUpToggleContext;