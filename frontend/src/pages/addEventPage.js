import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs"


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
 
export default function AddEvent() {

    const [dateTime, setDateTime] = useState("")
    const [eventType, setEventType] = useState("")
    const [description, setDescription] = useState("")
    const [game, setGame] = useState("")
    const [title, setTitle] = useState("")
    const [people, setPeople] = useState([])
    const [profiles, setProfiles] = useState([])

    const navigate = useNavigate();

    useEffect(() => {

        async function getProfiles() {
            try {
                const response = await fetch(`http://127.0.0.1:4000/api/profiles/default`);
                const profiles = await response.json();
                setProfiles(profiles);
            }
            catch(e) {
                const message = `An error occurred: ${e}`;
                window.alert(message);
                return;
            }
        }
        
        getProfiles();
        return;
    }, [])
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        try {
            const eventData = new FormData();
            eventData.append("time", dayjs(dateTime).format('HH:mm:ss'))
            eventData.append("year", Number(dayjs(dateTime).format('YYYY')))
            eventData.append("day", Number(dayjs(dateTime).format('DD')))
            eventData.append("month", Number(dayjs(dateTime).format('MM')))
            eventData.append("eventType", eventType)
            eventData.append("description", description)
            eventData.append("game", game)
            eventData.append("title", title)
            for (var i = 0; i < people.length; i++) {
                eventData.append('people[]', people[i]);
              }
            eventData.append("finished", false)

            await fetch(`http://127.0.0.1:4000/api/events`, {
                method: "POST",
                credentials: "include",
                body: eventData
            });
        }
        catch(err){
            const message = `An error occurred: ${err}`;
            window.alert(message);
            return;
        }
        
        navigate("/schedule");
    }

    function updatePeopleList(event) {
        let copy = people
        if (event.target.checked) {
            copy.push(event.target.value)
        }
        else {
            const index = copy.indexOf(event.target.value)
            copy.splice(index, 1)
        }
        setPeople(copy)
    }

    function listCheckBoxes() {
        return profiles.map((profile) => {
            return (
                <CheckBox
                    profile={profile}
                    func={updatePeopleList}
                />
            )
        })
    }
    
    return (
    <div>
        <h3>Add Event</h3>
        <form onSubmit={onSubmit}>
            <input 
            value={dateTime} 
            onChange={e => setDateTime(e.target.value)} 
            type="datetime-local" />
            <input 
            value={eventType} 
            onChange={e => setEventType(e.target.value)} 
            type="text" 
            placeholder="Event Type" />
            <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            type="text" 
            placeholder="Description" />
            <input 
            value={game} 
            onChange={e => setGame(e.target.value)} 
            type="text" 
            placeholder="Game" />
            <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            type="text" 
            placeholder="Title" />
            <fieldset>
                <legend>Select People</legend>
                {listCheckBoxes()}
            </fieldset>
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}