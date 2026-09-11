import React from "react";
import type { Dispatch, SetStateAction } from "react";
import useRiceEvent from "./hooks/useRiceEvent";
import { EventSchedule } from "./EventSchedule";
import { EventEditor } from "./EventEditor";
import ProfileList from "../Profile/ProfileList";



interface EventViewProps {
    viewMode : 'view' | 'schedule' | 'editor';
    toggleEventInfo : boolean;
    setToggleEventInfo : Dispatch<SetStateAction<boolean>>;
}


export default function EventView({viewMode, toggleEventInfo, setToggleEventInfo} : EventViewProps) {

    const { currentEvent, setCurrentEvent } = useRiceEvent();

    if (!currentEvent) {
        return <div/>
    }

    if (viewMode == 'schedule') {
        return <EventSchedule eventData={currentEvent} setEventData={setCurrentEvent} toggleEventInfo={toggleEventInfo} setToggleEventInfo={setToggleEventInfo}/>
    }
    if (viewMode == 'editor') {
        return <EventEditor eventData={currentEvent} setEventData={setCurrentEvent} toggleEventInfo={toggleEventInfo} setToggleEventInfo={setToggleEventInfo}/>
    }
    if (viewMode == 'view') {
        return (
            <React.Fragment>
                <p>{`Event: ${currentEvent.name}`}</p>
                <p>{`Desc: ${currentEvent.description}`}</p>
                <ProfileList 
                    profileFilter={currentEvent.participants.flatMap(x => x._id)} 
                    WrapperProps={{width: 100, height: 100, clickAction: null, styleOptions: null}}
                    profileContainer="profile-list-container-small"/>
            </React.Fragment>
        )
    }
}