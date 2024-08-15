import React, { useEffect, useState, useRef } from "react";
import "../style/home.css"
import GetUrl from "../GetUrl";
import { GenerateBracket } from "../components/Bracket/GenerateBracket";
import { Profile } from "../components/Profile/Profile";
 
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

    const shift = (offset) => {
        scrollRef.current.scrollLeft += offset;
    }
 
    return (
        <div>
            <section className="head">
                <p>The Rice Invitational<br/><br/></p>
            </section>
            <section>
                <p>Cool Thing!</p>
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