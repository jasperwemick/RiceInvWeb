import React, { useState, useEffect, useRef } from "react";
import GetUrl from "../../GetUrl"
import '../../style/home.css'
import { ProfileList } from "../Profile/ProfileList";
import { SelectableProfile } from "../Profile/SelectableProfile";


export function EventEditor({eventData, setEventData, toggleEventInfo, setToggleEventInfo}) {

    const setEventParticipants = (arr) => {
        setEventData({...eventData, participants: arr})
    }

    const onDelete = () => {
        const deleteEvent = async () => {
            try {
                await fetch(`${GetUrl}/api/events/ev/${eventData._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                })
            }
            catch(e) {
                console.log(`Failed to fetch (DELETE): ${e}`)
            }
        }

        deleteEvent()
    }



    /**
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
            WrapperProps={{
                selectedList: eventData.participants, 
                setSelectedList: setEventParticipants, 
                refreshTrigger: [eventData._id]
            }}/>
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
        <button onClick={() => onDelete()}>{`Delete Event`}</button>
    </div>
    );
}