import React, { useState, useEffect } from "react";
import { EventEditor } from "./EventEditor";
import { TimeEntry } from "./TimeEntry";
import useAuth from "../../hooks/userAuth";
import { EventSchedule } from "./EventSchedule";

export const EventInfo = ({toggleEventInfo, setToggleEventInfo, currentEvent, setCurrentEvent}) => {

    const [eventView, setEventView] = useState('view')

    // const [timeInvervalData, setTimeIntervalData] = useState(Array(48).fill(false))

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
            </div>
        </div>
    )
}