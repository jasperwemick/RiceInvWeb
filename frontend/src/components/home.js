import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
const Profile = (props) => (
    <li>
        <div>{props.profile.name}</div>
        <div>{props.profile.image}</div>
    </li>
);
 
export default function Home() {
    const [profiles, setProfiles] = useState([]);
 
    // This method fetches the jobs from the database.
    useEffect(() => {
        async function getProfiles() {
            try {
                const response = await fetch(`http://127.0.0.1:4000/api/profiles`)
                const profiles = await response.json();
                setProfiles(profiles);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }

        getProfiles();
        return;
    }, [profiles.length]);
 
    // This method will delete a job
    async function deleteProfile(id) {
        await fetch(`http://127.0.0.1:4000/api/profiles/${id}`, {
            method: "DELETE"
        });
    
        const newProfiles = profiles.filter((el) => el._id !== id);
        setProfiles(newProfiles);
    }
 
    // This method will map out the jobs on the table
    function profileList() {
        return profiles.map((profile) => {
            return (
                <Profile
                    profile={profile}
                    key={profile._id}
                />
            );
        });
    }
 
    // This following section will display the table with the jobs of individuals.
    return (
        <div>
            <h3>Profile List</h3>
            <ul>{profileList()}</ul>
        </div>
    );
}