import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "../style/brawlProfile.css"


const SetItem = (props) => {
    return (
        <li className={`list-row ${props.set.personalStats.winner ? 'list-win': 'list-lose'}`}>   
            <div className="list-element">{`${(props.set.formatType == 'Uppers' || props.set.formatType == 'Lowers') ? 'Playoffs': props.set.formatType}`}</div>
            <div className="list-element">{`${props.set.personalStats.winner ? 'Win': 'Loss'}`}</div>
            <div className="list-element">{props.set.personalStats.matchesWon} - {props.set.opponentStats.matchesWon}</div>
        </li>
    )
}

export default function BrawlProfilePage() {
    const [profile, setProfile] = useState({});
    const [brawlProfile, setBrawlProfile] = useState({});
    const [onesSets, setOnesSets] = useState([]);
    const [twosSets, setTwosSets] = useState([]);


    const params = useParams();

    useEffect(() => {
 
        const id = params.id.toString();
        async function getProfiles() {

            function descendingOrder(a, b) {
                if (a.setNumber > b.setNumber) {
                    return 1;
                }
                if (a.setNumber < b.setNumber) {
                    return -1;
                }
                return 0;
            } 

            try {
                const responseProfile = await fetch(`http://127.0.0.1:4000/api/profiles/${id}`)
                const profile = await responseProfile.json();

                const responseBrawlProfile = await fetch(`http://127.0.0.1:4000/api/profiles/brawl/${id}`)
                const brawlProfile = await responseBrawlProfile.json();

                const responseSets = await fetch(`http://127.0.0.1:4000/api/profiles/brawl/${id}/sets`)
                const sets = await responseSets.json();

                sets.sort(descendingOrder)

                const ones = sets.filter(x => x.gameType === 1)
                const twos = sets.filter(x => x.gameType === 2)

                const responseOnes = await fetch(`http://127.0.0.1:4000/api/profiles/brawl/${id}/sets/ones/stats`)
                const onesStats = await responseOnes.json();

                ones.forEach((item, i) => {
                    let setStats = onesStats.filter(x => x.setID === item._id);
                    let personalStats = setStats.find(x => x.profileID === id);
                    ones[i].personalStats = personalStats
                    ones[i].opponentStats = setStats.find(x => x.winner != personalStats.winner);
                });
                
                const responseTwos = await fetch(`http://127.0.0.1:4000/api/profiles/brawl/${id}/sets/twos/stats`)
                const twosStats = await responseTwos.json();

                twos.forEach((item, i) => {
                    let setStats = twosStats.filter(x => x.setID === item._id)
                    let personalStats = setStats.find(x => x.profileID === id);
                    twos[i].personalStats = personalStats
                    twos[i].opponentStats = setStats.find(x => x.winner != personalStats.winner);
                });

                setProfile(profile);
                setBrawlProfile(brawlProfile);
                setOnesSets(ones);
                setTwosSets(twos)
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }

        getProfiles();
        return;
        }, []);

    function setList(state) {
        return state.map((set) => {
            return (
                <SetItem
                    set={set}
                    key={set._id}
                />
            );
        });
    }

    function numToPlacement(num) {
        if (num === 1) {return num + 'st'}
        else if (num === 2) {return num + 'nd'}
        else if (num === 3) {return num + 'rd'}
        else {return num + 'th'}
    }

    return (
        <div>
            <div className="general-info-group">
                <div><span>{profile.name}</span></div>
                <img src={profile.imageUrl} alt="Player Profile"></img>
            </div>
            <div className="stat-group">
                <div><span>1v1 Placing: {numToPlacement(brawlProfile.onesPlacing)}</span></div>
                <div className="list-header">
                    <span className="list-element">Set Type</span>
                    <span className="list-element">Win/Loss</span>
                    <span className="list-element">Result</span>
                </div>
                <ul className="set-list">{setList(onesSets)}</ul>
                <div className="winrate"><span>1v1 Match Winrate: {Math.round((brawlProfile.onesMatchWins / (brawlProfile.onesMatchWins + brawlProfile.onesMatchLosses)) * 100)}%</span></div>
            </div>
            <div className="stat-group">
                <div><span>2v2 Placing: {numToPlacement(brawlProfile.twosPlacing)}</span></div>
                <div className="list-header">
                    <span className="list-element">Set Type</span>
                    <span className="list-element">Win/Loss</span>
                    <span className="list-element">Result</span>
                </div>
                <ul className="set-list">{setList(twosSets)}</ul>
                <div className="winrate"><span>2v2 Match Winrate: {Math.round((brawlProfile.twosMatchWins / (brawlProfile.twosMatchWins + brawlProfile.twosMatchLosses)) * 100)}%</span></div>
            </div>
            <div><span>2v2 Partner: {brawlProfile.partner}</span></div>
            <div><span>Favorite Legend: {brawlProfile.favoriteLegend}</span></div>
            <div><span>Rival(s): {brawlProfile.rival}</span></div>
        </div>
    )
}