import React, { useState, useEffect, useContext } from "react";
import { EventEditor } from "./EventEditor";
import useAuth from "../../hooks/userAuth";
import { EventSchedule } from "./EventSchedule";
import SchedulePopUpToggleContext from "./context/SchedulePopUpToggleProvider";
import EventContext from "./context/EventContextProvider";
import { ProfileList } from "../Profile/ProfileList";

export const EventInfo = ({}) => {

    const [eventView, setEventView] = useState('view')

    const { toggleEventInfo, setToggleEventInfo } = useContext(SchedulePopUpToggleContext)

    const { currentEvent, setCurrentEvent } = useContext(EventContext)

    const { auth, setAuth } = useAuth()

    const getEventView = (p) => {
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
        return auth.user ? auth.roles.includes("Admin") ? true : false : false
    }

    return (
        <div className={`time-entry-window`} style={toggleEventInfo ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
            <div style={{position: 'relative', display: 'flex', flexDirection: 'column'}}>
                <div>
                    <button 
                    style={checkAuth() ? {width: 200, height: 30} : {visibility: 'hidden', pointerEvents: 'none', width: 0, height: 0}} 
                    onClick={() => {setEventView(getEventView(eventView))}}>
                    {getEventView(eventView)}
                    </button>
                    <button style={{width: 200, height: 30}} onClick={() => {setToggleEventInfo(false)}}>{`Exit`}</button>
                </div>
                <div style={eventView === 'schedule' ? null : {visibility: 'hidden', pointerEvents: 'none', width: 0, height: 0}}>
                    <EventSchedule eventData={currentEvent} setEventData={setCurrentEvent} toggleEventInfo={toggleEventInfo} setToggleEventInfo={setToggleEventInfo}/>
                </div>
                <div style={eventView === 'editor' ? null : {visibility: 'hidden', pointerEvents: 'none', width: 0, height: 0}}>
                    <EventEditor eventData={currentEvent} setEventData={setCurrentEvent} toggleEventInfo={toggleEventInfo} setToggleEventInfo={setToggleEventInfo}/>
                </div>
                <div style={eventView === 'view' ? null : {visibility: 'hidden', pointerEvents: 'none', width: 0, height: 0}}>
                    <p>{`Event: ${currentEvent.name}`}</p>
                    <p>{`Desc: ${currentEvent.description}`}</p>
                    <ProfileList 
                    profileFilter={currentEvent.participants} 
                    WrapperProps={{width: 100, height: 100, clickAction: null, styleOptions: null}}
                    profileContainer="profile-list-container-small"/>
                </div>
            </div>
        </div>
    )
}