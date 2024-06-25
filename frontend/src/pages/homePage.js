import React, { useEffect, useState, useRef } from "react";
import "../style/home.css"
import GetUrl from "../GetUrl";
import { GenerateBracket } from "../components/GenerateBracket";
import { Profile } from "../components/Profile";
import { AddTimeEntry } from "../components/TimeEditor";
 
export default function Home() {
    const [profiles, setProfiles] = useState([]);
    const scrollRef = useRef(null);

    const [numPlayers, setNumPlayers] = useState(8);

    // useEffect(() => {
    //     async function getProfiles() {
    //         try {
    //             const response = await fetch(`${GetUrl}/api/profiles/default`);
    //             const profiles = await response.json();
    //             setProfiles(profiles);
    //         }
    //         catch(err) {
    //             const message = `An error occurred: ${err}`;
    //             console.log(message);
    //             return;
    //         }
    //     }

    //     getProfiles();
    //     return;
    // }, [profiles.length]);

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
            {/* <section className="profiles">
                <span>Profile List</span>
                <div className="profile-list-container">
                    <button onClick={() => shift(-1260)}>{'<'}</button>
                    <ul ref={scrollRef} className="profile-list">{profileList()}</ul>
                    <button onClick={() => shift(1260)}>{'>'}</button>
                </div>
            </section> */}
            <section>
                {/* Full Format: All players start in upper */}
                {/* Split Format: Half players start in upper, and half start in lower */}
                <GenerateBracket 
                    type={'Double'} 
                    numPlayers={numPlayers} 
                    format={'full'}
                    gameTag={'brawl'}/>
                <input 
                    type="range"
                    min={4}
                    max={24}
                    defaultValue={numPlayers}
                    onChange={(e) => setNumPlayers(e.target.value)}/>
                <span>{`Players: ${numPlayers}`}</span>
            </section>
        </div>
    );
}