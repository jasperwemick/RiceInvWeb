import React from "react";
import { ProfileList } from "./Profile/ProfileList"; 
import { NavigationProfile } from "./Profile/NavigationProfile";
import './style/home.css'


export default function Home() {

    // const [numPlayers, setNumPlayers] = useState(8);
 
    return (
        <div>
            <section>
                <div className={`home-title-container`}>
                    <div className={`home-title-text`}>
                        <p>The Rice Invitational</p>
                        <br/>
                        <br/>
                        <p>What??? Hell Yeah!!!</p>
                        <br/>
                        <br/>
                        <p>The Beautiful Competitors (and Me)</p>
                        <br/>
                    </div>
                    <div style={{display: "flex", justifyContent: 'center', width: '100%', height: 'fit-content'}}>
                        <ProfileList shiftOffset={500} Wrapper={NavigationProfile} WrapperProps={{currentLocation: '/', styleOptions: {background: 'linear-gradient(#afc0df, #a1a7e4)'}}}/>
                    </div>
                </div>
            </section>
            {/* <section>
                <div className={`home-grid`}>

                </div>
            </section> */}
        </div>
    );
}