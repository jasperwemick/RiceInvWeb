import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { InferProps } from 'prop-types'
import GetUrl from "../../GetUrl"
import '../../style/home.css'


// TODO: Use proptypes to add defintion to params, https://stackoverflow.com/questions/71223891/react-and-jsdoc-how-to-document-a-react-component-properly
const PlayerProfile = ({profile, setEventData, eventData}) => {

    const [selected, setSelected] = useState(false)

    useEffect(() => {

        if (eventData.participants.find((p) => p === profile._id)) {
            setSelected(true)
        }

    }, [eventData.tag])

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
        <li>
            <div style={selected ? {backgroundColor: "lightblue"} : null}
                onClick={() => handleClick()}>
                {/* <img src={profile.imageUrl} width={wt} height={ht} alt="Player Profile"></img> */}
                <span>{profile.name}</span>
            </div>
        </li>
    )
}


export function EventEditor({eventData, setEventData}) {


    const [profiles, setProfiles] = useState([])

    const scrollRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {

        async function getProfiles() {
            try {
                const response = await fetch(`${GetUrl}/api/profiles/default`);
                const jsponse = await response.json();

                setProfiles(jsponse)
            }
            catch(e) {
                const message = `An error occurred: ${e}`;
                console.log(message)
                return;
            }
        }
        
        getProfiles();
        return;
    }, [])
    
    /**
     * 
     * @param {Event} e - Submission onClick event
     */
    function onSubmit(e) {
        e.preventDefault();

        const upsertEventData = async () => {

            try {
                await fetch(`${GetUrl}/api/events/ev/${eventData.tag}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(eventData)
                })
            }
            catch(e) {
                console.log(`Failed to fetch (PUT): ${e}`)
            }
        }

        upsertEventData()
    }

    /**
     * 
     * @returns A list of PlayerProfile components
     */
    function profileList() {
        return profiles.map((profile, index) => {
            return (
                <PlayerProfile profile={profile} setEventData={setEventData} eventData={eventData} key={index}/>
            );
        });
    }

    /**
     * @param {Number} offset - The offset value to shift the list
     */
    const shift = (offset) => {
        scrollRef.current.scrollLeft += offset;
    }
    
    return (
    <div>
        <h3>Add Event</h3>
        <div className="profile-list-container-small">
            <button onClick={() => shift(-200)}>{'<'}</button>
            <ul ref={scrollRef} className="profile-list">{profileList()}</ul>
            <button onClick={() => shift(200)}>{'>'}</button>
        </div>
        <form onSubmit={onSubmit}>
            <input 
                value={eventData.name || ''} 
                onChange={e => setEventData({...eventData, name: e.target.value, tag: e.target.value.replace(/[^a-z0-9]/gi, '')})} 
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