import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import GetUrl from "../GetUrl";

export default function Description() {
 
    const [profile, setProfile] = useState({})

    const params = useParams();
    
    useEffect(() => {
        async function getProfile() {
            const id = params.id.toString();

            try {
                const response = await fetch(`${GetUrl}/api/profiles/default/${id}`);
                const profile = await response.json();
                setProfile(profile);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message);
                return;
            }
        }

        getProfile();
        return;
    }, [params.id]);

    return (
        <div>
            <h2>
                {profile.name}
            </h2>
            <img src={profile.imageUrl} alt="Player Profile"></img>
            <h4>
                {profile.description}
            </h4>
            <div><Link to={`/league/${profile._id}`}>League</Link></div>
            <div><Link to={`/edit/${profile._id}`}>Edit</Link></div>
            <div><Link to={`/brawl/${profile._id}`}>Brawlhalla</Link></div>
        </div>
    )
}