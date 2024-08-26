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
                        <p>Gaming! Epic! Hell Yeah!</p>
                        <br/>
                        <br/>
                        <p>The Beautiful Competitors (and Me)</p>
                        <br/>
                    </div>
                    <div style={{display: "flex", justifyContent: 'center', width: '100%', height: '100%'}}>
                        <ProfileList Wrapper={NavigationProfile} WrapperProps={{currentLocation: '/'}}/>
                    </div>
                </div>
            </section>
            <section>
                <div className={`home-grid`}>

                </div>
            </section>
        </div>
    );
}