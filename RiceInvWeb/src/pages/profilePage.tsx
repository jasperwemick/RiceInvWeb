import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import apiFetch from "../util/fetch";
import type { Profile } from "../data/types";

export default function Description() {
 
    const [profile, setProfile] = useState<Profile | null>(null)

    const params = useParams<"/:id">();
    
    useEffect(() => {
        async function getProfile() {
            const id = params.id;

            try {
                const profile = await apiFetch<Profile>(`/api/profiles/default/${id}`);
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
                {profile?.name}
            </h2>
            <img src={profile?.imageURL} alt="Player Profile"></img>
            <h4>
                {profile?.description}
            </h4>
            <div><Link to={`/league/${profile?._id}`}>League</Link></div>
            <div><Link to={`/edit/${profile?._id}`}>Edit</Link></div>
            <div><Link to={`/brawl/${profile?._id}`}>Brawlhalla</Link></div>
        </div>
    )
}