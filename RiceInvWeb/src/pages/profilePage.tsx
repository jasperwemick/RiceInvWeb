import { useState, useEffect } from "react";
import { useParams } from "wouter";
import apiFetch from "../util/fetch";
import type { Profile } from "../data/types";

export default function ProfilePage() {
 
    const [profile, setProfile] = useState<Profile | null>(null)

    const params = useParams<"/:id">();
    
    useEffect(() => {
        const getProfile = async () => {
            const id = params.id;

            try {
                const profile = await apiFetch<Profile>(`/api/profiles/${id}`);
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
            <p>{profile?.name}</p>
            <img src={profile?.imageUrl} alt="Player Profile"></img>
            <p>{profile?.description}</p>
        </div>
    )
}