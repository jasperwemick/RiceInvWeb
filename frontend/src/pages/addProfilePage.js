import React, { useState } from "react";
import { useNavigate } from "react-router";
import GetUrl from "../GetUrl";
 
export default function Add() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState()
    const [brawlPoints, setBrawlPoints] = useState(0)
    const [leaguePoints, setLeaguePoints] = useState(0)
    const [valPoints, setValPoints] = useState(0)
    const [bullPoints, setBullPoints] = useState(0)
    const [rocketPoints, setRocketPoints] = useState(0)
    const [mysteryPoints, setMysteryPoints] = useState(0)
    const [counterPoints, setCounterPoints] = useState(0)
    const [bonusPoints, setBonusPoints] = useState(0)

    const [gamertag, setGamertag] = useState("")
    const [user, setUser] = useState("")

    const navigate = useNavigate();
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        try {

            let sum = Number(brawlPoints + leaguePoints + valPoints + bullPoints + rocketPoints + mysteryPoints + counterPoints + Number(bonusPoints));

            const profileData = new FormData();
            profileData.append("name", name)
            profileData.append("description", description)
            profileData.append("ricePoints", sum)
            profileData.append("image", file)
            profileData.append("brawlPoints", brawlPoints)
            profileData.append("leaguePoints", leaguePoints)
            profileData.append("valPoints", valPoints)
            profileData.append("bullPoints", bullPoints)
            profileData.append("rocketPoints", rocketPoints)
            profileData.append("mysteryPoints", mysteryPoints)
            profileData.append("counterPoints", counterPoints)
            profileData.append("bonusPoints", bonusPoints)
            profileData.append("gamertag", gamertag)
            profileData.append("user", user)

            await fetch(`${GetUrl}/api/profiles/default`, {
                method: "POST",
                credentials: "include",
                body: profileData
            })
        }
        catch(err){
            const message = `An error occurred: ${err}`;
            console.log(message)
            return;
        }
        
        navigate("/");
    }

    function validateNumber(e, setter) {
        if (e.target.value.includes('-')) {
            if (e.target.value[0] !== '-') {
                e.preventDefault();
                return;
            }
        }
        else if (! /^[0-9]+$/.test(e.target.value) && e.target.value.length > 0) {
            e.preventDefault();
            return;
        }
        setter(Number(e.target.value));
    }
    
    return (
    <div>
        <h3>Add Profile</h3>
        <form onSubmit={onSubmit}>
            <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            type="text" 
            placeholder="Name"
            />
            <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            type="text" 
            placeholder="Description" />
            <input
            value={gamertag}
            onChange={e => setGamertag(e.target.value)}
            type="text"
            placeholder="Gamertag" />
            <input
            value={user}
            onChange={e => setUser(e.target.value)}
            type="text"
            placeholder="User" />
            <input 
            onChange={e => setFile(e.target.files[0])} 
            type="file" 
            accept="image/*" />
            <input
            value={brawlPoints}
            onChange={e => validateNumber(e, setBrawlPoints)}
            type="text" />
            <input
            value={leaguePoints}
            onChange={e => validateNumber(e, setLeaguePoints)}
            type="text" />
            <input
            value={valPoints}
            onChange={e => validateNumber(e, setValPoints)}
            type="text" />
            <input
            value={bullPoints}
            onChange={e => validateNumber(e, setBullPoints)}
            type="text" />
            <input
            value={rocketPoints}
            onChange={e => validateNumber(e, setRocketPoints)}
            type="text" />
            <input
            value={mysteryPoints}
            onChange={e => validateNumber(e, setMysteryPoints)}
            type="text" />
            <input
            value={counterPoints}
            onChange={e => validateNumber(e, setCounterPoints)}
            type="text" />
            <input
            value={bonusPoints}
            onChange={e => validateNumber(e, setBonusPoints)}
            type="text" />
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}