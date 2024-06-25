import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { InferProps } from 'prop-types'
import GetUrl from "../GetUrl"
import '../style/home.css'
import { TimeEntry } from "./TimeEntry";

const CheckBox = (props) => {
    return (
        <div>
            <input
            value={props.profile._id}
            type="checkbox"
            onChange={e => props.func(e)}/>
            <label for={props.profile._id}>{props.profile.name}</label>
        </div>
    )
}


// TODO: Use proptypes to add defintion to params, https://stackoverflow.com/questions/71223891/react-and-jsdoc-how-to-document-a-react-component-properly
const PlayerProfile = ({profile, setEventData, eventData}) => {

    const [selected, setSelected] = useState(false)

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


export function EventEditor({ date }) {

    const [timeInvervalData, setTimeIntervalData] = useState(Array(48).fill(false))

    const [eventData, setEventData] = useState({
        tag: '',
        name: '',
        description: '',
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        group: '',
        timeRange: [],
        participants: [],
    })

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


    useEffect(() => {   //debug
        console.log(eventData.participants)
    }, [eventData.participants.length])
    
    /**
     * 
     * @param {Event} e - Submission onClick event
     */
    async function onSubmit(e) {
        e.preventDefault();

        // Reduce to alphanumeric
        const tag = eventData.name.replace(/[^a-z0-9]/gi, '')

        setEventData({...eventData, tag: tag, timeRange: timeInvervalData})

        const upsertEventData = async () => {

            try {
                await fetch(`${GetUrl}/api/events/ev/${eventData.year}/${eventData.month}/${eventData.day}/${tag}`, {
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
        <TimeEntry timeInvervalData={timeInvervalData} setTimeIntervalData={setTimeIntervalData}/>
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
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}