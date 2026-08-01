import { useContext } from "react";
import SchedulePopUpToggleContext from "../context/SchedulePopUpToggleProvider";


export default function useSchedulePopUp() {
    const context = useContext(SchedulePopUpToggleContext);
    if (!context) {
        throw new Error('Schedule Pop up Not Available');
    }
    return context;
}