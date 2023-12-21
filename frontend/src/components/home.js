import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style/home.css"
 
const Profile = (props) => (
    <li>
        <div className="profile-image">
            <Link to={`/${props.profile._id}`}>
                <img src={props.profile.imageUrl} alt="Player Profile"></img>
            </Link>
        </div>
        <div className="profile-name">{props.profile.name}</div>
    </li>
);
 
export default function Home() {
    const [profiles, setProfiles] = useState([]);
 
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
 
    return (
        <div>
            <section className="head">
                <h1>Rice Invitational</h1>
                
            </section>
            <section className="profiles">
                <h3>Profile List</h3>
                <ul className="profile-list">{profileList()}</ul>
            </section>
            <section>

            </section>
        </div>
    );
}