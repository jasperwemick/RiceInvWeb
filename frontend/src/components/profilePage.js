import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

export default function Description() {
 
    const [profile, setProfile] = useState({})

    const params = useParams();
    
    useEffect(() => {
        async function getProfile() {
            const id = params.id.toString();

            try {
                const response = await fetch(`http://127.0.0.1:4000/api/profiles/${id}`);
                const profile = await response.json();
                setProfile(profile);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }

        getProfile();
        return;
    }, [params.id]);

    return (
        <div>
            {profile.name}
            <Link to={`/edit/${profile._id}`}>Edit</Link>
            {profile.description}
            <Link to={`/league/${profile._id}`}>League</Link>
        </div>
    )
}