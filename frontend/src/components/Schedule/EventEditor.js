import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { InferProps } from 'prop-types'
import GetUrl from "../../GetUrl"
import '../../style/home.css'
import { Profile } from "../Profile/Profile";
import { ProfileList } from "../Profile/ProfileList";
import { SelectableProfile } from "../Profile/SelectableProfile";


const EventEditorProfile = ({profile, setEventData, eventData}) => {

    const [selected, setSelected] = useState(false)

    useEffect(() => {

        if (eventData.participants.find((p) => p === profile._id)) {
            setSelected(true)
        }
        else {
            setSelected(false)
        }

    }, [eventData._id])

    const handleClick = () => {
        const newStatus = !selected

        if (newStatus) {
            setEventData({...eventData, participants: [...eventData.participants, profile._id]})
        }
        else {

            const newArr = eventData.participants.filter((pid) => pid !== profile._id)
            setEventData({...eventData, participants: newArr})
        }

        setSelected(newStatus)
    }

    return (
        <Profile profile={profile} wt={50} ht={50} clickAction={handleClick} styleOptions={selected ? {backgroundColor: "lightblue"} : null}/>
    )
}


export function EventEditor({eventData, setEventData, toggleEventInfo, setToggleEventInfo}) {


    const setEventParticipants = (arr) => {
        setEventData({...eventData, participants: arr})
    }


    /**
     * 
     * @param {Event} e - Submission onClick event
     */
    function onSubmit(e) {
        e.preventDefault();

        const upsertEventData = async () => {

            try {
                await fetch(`${GetUrl}/api/events/ev/${eventData._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(eventData)
                })
            }
            catch(e) {
                console.log(`Failed to fetch (PUT): ${e}`)
            }
        }

        upsertEventData()
        setToggleEventInfo(false)
    }
    
    return (
    <div>
        <h3>Add Event</h3>
        <ProfileList 
            shiftOffset={200}
            Wrapper={SelectableProfile} 
            WrapperProps={
                {selectedList: eventData.participants, setSelectedList: setEventParticipants, refreshTrigger: eventData._id}
            }/>
        <form onSubmit={onSubmit}>
            <input 
                value={eventData.name || ''} 
                onChange={e => setEventData({...eventData, name: e.target.value})} 
                type='text'
                placeholder='Name'/>
            <input 
                value={eventData.description || ''} 
                onChange={e => setEventData({...eventData, description: e.target.value})} 
                type='text'
                placeholder='Desc' />
            <input 
                value={eventData.group || ''} 
                onChange={e => setEventData({...eventData, group: e.target.value})} 
                type="text" 
                placeholder="Game/Event Type" />
            <input
                value={eventData.duration || ''}
                onChange={e => setEventData({...eventData, duration: e.target.value})}
                type="text"
                placeholder="Duration (Hours)"/>
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}