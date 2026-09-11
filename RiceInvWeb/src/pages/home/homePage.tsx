import { NavigationProfile } from "../../components/Profile/NavigationProfile";
import './home.css'
import ProfileList from "../../components/Profile/ProfileList";
import MeInfo from "./components/MeInfo";
import ScrollFrameSequence from "./components/ScrollFrameSequence";

export default function Home() { 

    const NUMFRAMES = 5;

    return (
        <div>
            <section>
                <div className={`home-title-container`}>
                    <div className={`home-title-header`}>
                        <div className={`home-title-text`}>
                            <p>The Rice Invitational</p>
                        </div>
                        <img src={`src/assets/rice.png`}></img>
                    </div>
                    <div style={{display: "flex", justifyContent: 'center', width: '100%', height: 'fit-content'}}>
                        <ProfileList 
                        Wrapper={NavigationProfile}
                        WrapperProps={{currentLocation: '/', styleOptions: {background: 'linear-gradient(#afc0df, #a1a7e4)'}}}
                        isInfinite={true}/>
                    </div>
                </div>
            </section>
            <section style={{ background : 'linear-gradient(#9198e5, #6998e9ff)', height : '20vh'}}></section>
            <section style={{ background: 'linear-gradient(#6998e9ff, #4071c5)'}}>
                <ScrollFrameSequence frames={Array.from({ length : NUMFRAMES + 1 }, () => MeInfo)}/>
            </section>
            <section>
                <div className={`home-coming-soon`}></div>
            </section>
        </div>
    );
}