import React, { useState } from "react";
import { GenerateBracket } from "./Bracket/GenerateBracket";
import { ProfileList } from "./Profile/ProfileList"; 


export default function Home() {

    const [numPlayers, setNumPlayers] = useState(8);
 
    return (
        <div>
            <section className="head">
                <p>The Rice Invitational<br/><br/></p>
            </section>
            <section>
                <ProfileList />
                {/* <ul style={{width: 600, height: 200, position: 'relative'}}>{mapProfiles()}</ul> */}
                <p>Cool Thing!</p>
                {/* Full Format: All players start in upper */}
                {/* Split Format: Half players start in upper, and half start in lower */}
                <GenerateBracket 
                    type={'Double'} 
                    numPlayers={numPlayers} 
                    format={'full'}
                    gameTag={'null'}/>
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