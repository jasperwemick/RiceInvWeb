import React, { useState, useEffect, useContext } from "react";
import "../style/brawlPage.css"
import { Link } from "react-router-dom";
import Placement from "../components/Placement";
import GetUrl from "../GetUrl";
import useProfiles from "../components/Profile/hooks/useProfiles";
import ProfileContext from "../components/Profile/context/ProfileContextProvider";


export default function BrawlHomePage() {

    // const [brawlProfiles, setBrawlProfiles] = useState([])
    const [ones, setOnes] = useState([])
    const [twos, setTwos] = useState([])

    const { profiles } = useContext(ProfileContext)

    useProfiles()

    useEffect(() => {

        const getPlacings = async () => {

            try {
                function ascendingOrder(a, b) {
                    if (a.placing < b.placing) {
                        return -1;
                    }
                    if (a.placing > b.placing) {
                        return 1;
                    }
                    return 0;
                } 
                
                const responseBrawl = await fetch(`${GetUrl}/api/profiles/brawl`);
                const brawl = await responseBrawl.json();
                
                const onevone = brawl.map((item) => {
                    const { playerID, onesPlacing } = item;
                    const mappedName = [ profiles.find(x => x._id === playerID).name ]
                    const placing = onesPlacing;
                    return { mappedName, placing, scores: 1 }
                });
    
                onevone.sort(ascendingOrder);
    
                const twovtwo = brawl.map((item) => {
                    const { playerID, twosPlacing, partner } = item;
                    const mappedName = [ profiles.find(x => x._id === playerID).name ];
                    let partnerName = profiles.find(x => x._id === partner)?.name;
                    if (!partnerName) {
                        partnerName = "";
                    }
                    const teamKey = (mappedName[0] + partnerName).split('').sort().join('').trim()
                    const placing = twosPlacing;
                    return { mappedName, placing, scores: 2, teamKey }
                });
    
                const merged = Object.values(twovtwo.reduce((acc, item) => {
    
                    acc[item.teamKey] = acc[item.teamKey] || {mappedName: [], placing: item.placing, scores: item.scores, teamKey: item.teamKey}
                    acc[item.teamKey].mappedName = [ ...acc[item.teamKey].mappedName, ...item.mappedName]
                    return acc;          
                }, {}))
    
                merged.sort(ascendingOrder);
    
                // Merge player names or make new component
                // setBrawlProfiles(brawl);
                setOnes(onevone);
                setTwos(merged);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message)
                return;
            }

        }
        getPlacings();
        return;
    }, []);

    const placingList = (state) => {
        return state.map((item) => {
            return (
                <Placement
                    placement={item}
                    key={item.mappedName}
                />
            );
        });
    }
    return (
        <div>
            <div><span>Brawlhalla</span></div>
            <div><span>Brawlhalla is a Premiere game in the Rice Invitational</span></div>
            <table>
                <thead>
                    <tr>
                        <th><span>Placing</span></th>
                        <th><span>Player</span></th>
                        <th><span>RI Points</span></th>
                    </tr>
                </thead>
                <tbody>
                    {placingList(ones)}
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th><span>Placing</span></th>
                        <th><span>Player</span></th>
                        <th><span>RI Points</span></th>
                    </tr>
                </thead>
                <tbody>
                    {placingList(twos)}
                </tbody>
            </table>
            <div className="ones-block">
                <div className="brawl-button"><Link to='/brawl/ones'>Singles</Link></div>
            </div>
            <div className="twos-block">
                <div className="brawl-button"><Link to='/brawl/twos'>Doubles</Link></div>
            </div>
        </div>
    )
}