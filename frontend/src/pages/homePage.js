import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../style/home.css"
 
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
    const scrollRef = useRef(null);

    useEffect(() => {
        async function getProfiles() {
            try {
                const response = await fetch(`http://127.0.0.1:4000/api/profiles/default`);
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

    const shift = (offset) => {
        scrollRef.current.scrollLeft += offset;
    }
 
    return (
        <div>
            <section className="head">
                <span>The Rice Invitational<br/><br/></span>
                <span>Welcome the Rice Invitational web page, a page I made for a tournament that my friends (and sometimes I) play in<br/><br/></span>
                <span>I'm sure you'll notice the styling is greatly lacking! A Heavy WIP with much more to come, I'm developing this on a MERN stack for educational purposes<br/><br/></span>
                <span>Thanks for visiting - Jasper<br/><br/></span>
            </section>
            <section className="profiles">
                <span>Profile List</span>
                <div className="profile-list-container">
                    <button onClick={() => shift(-1260)}>{'<'}</button>
                    <ul ref={scrollRef} className="profile-list">{profileList()}</ul>
                    <button onClick={() => shift(1260)}>{'>'}</button>
                </div>
            </section>
            <section>

            </section>
        </div>
    );
}