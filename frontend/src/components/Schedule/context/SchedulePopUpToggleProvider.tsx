import { createContext, Dispatch, SetStateAction, useState } from "react";
import { TimeEntry } from "../../../data/types";

interface SchedulePopUpToggleProps {
    toggleTimeEntry : boolean;
    setToggleTimeEntry : Dispatch<SetStateAction<boolean>>;
    toggleTimeOverview : boolean;
    setToggleTimeOverview : Dispatch<SetStateAction<boolean>>;
    toggleEventInfo : boolean;
    setToggleEventInfo : Dispatch<SetStateAction<boolean>>;
    toggleDayOverview : boolean;
    setToggleDayOverview : Dispatch<SetStateAction<boolean>>;
    monthlyTimeEntries : TimeEntry[];
    setMonthlyTimeEntries : Dispatch<SetStateAction<TimeEntry[]>>;
}

const SchedulePopUpToggleContext = createContext<SchedulePopUpToggleProps | null>(null);

export const SchedulePopUpToggleProvider = ({children} : { children : React.ReactNode }) => {

    const [toggleTimeEntry, setToggleTimeEntry] = useState<boolean>(false);
    const [toggleTimeOverview, setToggleTimeOverview] = useState<boolean>(false);
    const [toggleEventInfo, setToggleEventInfo] = useState<boolean>(false);
    const [toggleDayOverview, setToggleDayOverview] = useState<boolean>(false);
    const [monthlyTimeEntries, setMonthlyTimeEntries] = useState<TimeEntry[]>([]);

    return (
        <SchedulePopUpToggleContext.Provider value={{toggleTimeEntry, setToggleTimeEntry, toggleTimeOverview, setToggleTimeOverview, toggleEventInfo, setToggleEventInfo, 
            toggleDayOverview, setToggleDayOverview, monthlyTimeEntries, setMonthlyTimeEntries}}>
            {children}
        </SchedulePopUpToggleContext.Provider>
    )
}

export default SchedulePopUpToggleContext;