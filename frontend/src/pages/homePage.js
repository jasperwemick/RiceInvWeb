import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/home.css"
import useAuth from "../hooks/userAuth";
 
const Profile = (props) => (
    <li>
        <div className="profile-image">
            <Link to={`/${props.profile._id}`}>
                <img src={props.profile.imageUrl} width="300" height="375" alt="Player Profile"></img>
            </Link>
        </div>
        <div className="profile-name">{props.profile.name}</div>
    </li>
);
 
export default function Home() {
    const [profiles, setProfiles] = useState([]);

    const { setAuth } = useAuth();
 
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

    useEffect(() => {
        async function validateCookie() {
            try {
                const responeAgain = await fetch(`http://127.0.0.1:4000/auth/user`, {
                    credentials: 'include'
                })
                const actualData = await responeAgain.json();
                console.log(actualData.message)
                const roles = actualData?.roles;
                const user = actualData?.user;
                setAuth({ user, roles });
            }
            catch(e) {
                const message = `Failed to Validate Cookie ${e}`;
                console.log(message)
                return;
            }
        }

        validateCookie();
        return;
    }, [])
 
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
                <h3>Welcome the Rice Invitational Web Page, the styling is currently garbage!</h3>
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