import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import GetUrl from "../GetUrl";
 
export default function Edit() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [brawlPoints, setBrawlPoints] = useState(0)
    const [leaguePoints, setLeaguePoints] = useState(0)
    const [valPoints, setValPoints] = useState(0)
    const [bullPoints, setBullPoints] = useState(0)
    const [rocketPoints, setRocketPoints] = useState(0)
    const [mysteryPoints, setMysteryPoints] = useState(0)
    const [counterPoints, setCounterPoints] = useState(0)
    const [bonusPoints, setBonusPoints] = useState(0)

    const [gamertag, setGamertag] = useState("")

    const [url, setUrl] = useState("")

    const params = useParams();
    const navigate = useNavigate();
 
    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            try {
                const profiles = await fetch(`${GetUrl}/api/profiles/default/${id}`);
                const profile = await profiles.json();

                console.log(profile)

                setName(profile.name);
                setDescription(profile.description);
                setGamertag(profile.gamertag)
                setUrl(profile.imageUrl)
                setBrawlPoints(profile.brawlPoints);
                setLeaguePoints(profile.leaguePoints);
                setValPoints(profile.valPoints);
                setBullPoints(profile.bullPoints);
                setRocketPoints(profile.rocketPoints);
                setMysteryPoints(profile.mysteryPoints);
                setCounterPoints(profile.counterPoints);
                setBonusPoints(profile.bonusPoints);

            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }

        }

        fetchData();

        return;
    }, [params.id, navigate]);
 
    async function onSubmit(e) {
        e.preventDefault();

        const id = params.id.toString();
        
        let sum = Number(brawlPoints + leaguePoints + valPoints + bullPoints + rocketPoints + mysteryPoints + counterPoints + Number(bonusPoints));
        
        const profileData = new FormData();
        profileData.append("name", name);
        profileData.append("description", description);
        profileData.append("gamertag", gamertag)
        profileData.append("ricePoints", sum)
        profileData.append("brawlPoints", brawlPoints)
        profileData.append("leaguePoints", leaguePoints)
        profileData.append("valPoints", valPoints)
        profileData.append("bullPoints", bullPoints)
        profileData.append("rocketPoints", rocketPoints)
        profileData.append("mysteryPoints", mysteryPoints)
        profileData.append("counterPoints", counterPoints)
        profileData.append("bonusPoints", bonusPoints)
        try {
            await fetch(`${GetUrl}/api/profiles/default/${id}`, {
                method: "PATCH",
                credentials: "include",
                body: profileData
            })
        }
        catch(err){
            const message = `An error occurred: ${err}`;
            window.alert(message);
            return;
        }
        
        navigate("/");
    }

    async function updateImage(e) {
        e.preventDefault();

        const id = params.id.toString();

        try {
            // Remove old image from database
            await fetch(`${GetUrl}/api/profiles/default/${id}/images`, {
                method: "DELETE",
                credentials: "include"
            });

            // Add new image to database
            const fileData = new FormData();
            fileData.append("image", e.target.files[0]);
            await fetch(`${GetUrl}/api/profiles/default/images`, {
                method: "POST",
                credentials: "include",
                body: fileData
            });

            // Update imageName field
            await fetch(`${GetUrl}/api/profiles/default/${id}/images`, {
                method: "PATCH",
                credentials: "include",
                body: fileData
            })

            // Show new image in editor
            const response = await fetch(`${GetUrl}/api/profiles/default/${id}/images`);
            const profile = await response.json();
            setUrl(profile.imageUrl);
        }
        catch(err) {
            const message = `An error occurred: ${err}`;
            console.log(message);
            return;
        }
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
        <h3>Update Profile</h3>
        <form onSubmit={onSubmit}>
            <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            />
            <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            type="text"
            />
            <input
            value={gamertag}
            onChange={e => setGamertag(e.target.value)}
            type="text"
            />
            <input
            onChange={e => updateImage(e)}
            type="file"
            accept="image/*"
            />
            <img src={url} alt=""></img>
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
            <input
            value="Update Profile"
            type="submit"
            />
        </form>
        
    </div>
    );
}