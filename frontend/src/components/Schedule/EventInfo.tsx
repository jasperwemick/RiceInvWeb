import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useSchedulePopUp from "./hooks/useSchedulePopUp";
import EventView from "./EventView";

export default function EventInfo() {

    const { toggleEventInfo, setToggleEventInfo } = useSchedulePopUp();
    const { auth, setAuth } = useAuth()

    const [eventView, setEventView] = useState<'view' | 'schedule' | 'editor'>('view')


    const getEventView = (p : string) => {
        switch (p) {
            case 'view':
                return 'schedule';
            case 'schedule':
                return 'editor';
            case 'editor':
                return 'view';
            default:
                return 'view'
        }
    }

    const checkAuth = () => {
        return auth ? auth.roles.includes("Admin") ? true : false : false
    }

    return (
        <div className={`time-entry-window`} style={toggleEventInfo ? undefined : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div style={{position: 'relative', display: 'flex', flexDirection: 'column'}}>
                <div>
                    <button 
                    style={checkAuth() ? {width: 200, height: 30} : {visibility: 'hidden', pointerEvents: 'none', width: 0, height: 0}} 
                    onClick={() => {setEventView(getEventView(eventView))}}>
                    {getEventView(eventView)}
                    </button>
                    <button style={{width: 200, height: 30}} onClick={() => {setToggleEventInfo(false)}}>{`Exit`}</button>
                </div>
                <div>
                    <EventView 
                    viewMode={eventView}  
                    toggleEventInfo={toggleEventInfo} 
                    setToggleEventInfo={setToggleEventInfo}/>
                </div>
            </div>
        </div>
    )
}