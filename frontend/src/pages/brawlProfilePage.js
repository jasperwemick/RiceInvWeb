import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import "../style/brawlProfile.css"
import GetUrl from "../GetUrl";


const SetItem = (props) => {

    const [gameDropdown, setGameDropdown] = useState(false)
    // const [opponent, setOpponent] = useState({})

    const toggle = () => {
        setGameDropdown(!gameDropdown)
    }

    return (
        <React.Fragment>
            <li className={`list-row ${props.set.personalStats.winner ? 'list-win': 'list-lose'}`} onClick={() => {toggle();}}>   
                <span>{`${(props.set.formatType === 'Uppers' || props.set.formatType === 'Lowers') ? 'Playoffs': props.set.formatType}`}</span>
                <span>{`${props.set.personalStats.winner ? 'Win': 'Loss'}`}</span>
                <span>{props.set.personalStats.matchesWon} - {props.set.opponentStats.matchesWon}</span>
            </li>
            <li>
                <div className={`${gameDropdown ? 'list-details-expand-brawl': 'list-details-shrink-brawl'}`}>
                    <div className={`${gameDropdown ? '': 'hidden'}`}>
                        <span>Vs: {props.set.opponentName.join(' / ')}</span>
                    </div>
                </div>
            </li>
        </React.Fragment>
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
                const responseProfile = await fetch(`${GetUrl}/api/profiles/default`)
                const profiles = await responseProfile.json();

                const responseBrawlProfile = await fetch(`${GetUrl}/api/profiles/brawl/${id}`)
                const brawlProfile = await responseBrawlProfile.json();

                const responseSets = await fetch(`${GetUrl}/api/profiles/brawl/${id}/sets`)
                const sets = await responseSets.json();

                sets.sort(descendingOrder)

                const ones = sets.filter(x => x.gameType === 1)
                const twos = sets.filter(x => x.gameType === 2)

                const responseOnes = await fetch(`${GetUrl}/api/profiles/brawl/${id}/sets/ones/stats`)
                const onesStats = await responseOnes.json();

                const responseTwos = await fetch(`${GetUrl}/api/profiles/brawl/${id}/sets/twos/stats`)
                const twosStats = await responseTwos.json();

                ones.forEach((item, i) => {
                    let setStats = onesStats.filter(x => x.setID === item._id);
                    let personalStats = setStats.find(x => x.profileID === id);
                    ones[i].personalStats = personalStats
                    const opponentStats = setStats.find(x => x.winner !== personalStats.winner);
                    ones[i].opponentStats = opponentStats;
                    ones[i].opponentName = [ profiles.find(x => x._id === opponentStats.profileID).name ];
                    console.log(ones[i].opponentName)
                });
                
                twos.forEach((item, i) => {
                    let setStats = twosStats.filter(x => x.setID === item._id)
                    let personalStats = setStats.find(x => x.profileID === id);
                    twos[i].personalStats = personalStats
                    const opponentDoublesStats = setStats.filter(x => x.winner !== personalStats.winner);
                    twos[i].opponentStats = opponentDoublesStats[0];
                    twos[i].opponentName = []
                    opponentDoublesStats.forEach((opponent) => {
                        twos[i].opponentName.push(profiles.find(x => x._id === opponent.profileID).name);
                    })
                });

                const thisProfile = profiles.find(x => x._id === id)
                setProfile(thisProfile);
                setBrawlProfile(brawlProfile);
                setOnesSets(ones);
                setTwosSets(twos);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message);
                return;
            }
        }

        getProfiles();
        return;
        }, [params.id]);

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
                <div>
                    <span>Set Type</span>
                    <span>Win/Loss</span>
                    <span>Result</span>
                </div>
                    <ul className="game-list">{setList(onesSets)}</ul>
                <div className="winrate"><span>1v1 Match Winrate: {Math.round((brawlProfile.onesMatchWins / (brawlProfile.onesMatchWins + brawlProfile.onesMatchLosses)) * 100)}%</span></div>
            </div>
            <div className="stat-group">
                <div><span>2v2 Placing: {numToPlacement(brawlProfile.twosPlacing)}</span></div>
                    <span>Set Type</span>
                    <span>Win/Loss</span>
                    <span>Result</span>
                    <ul className="game-list">{setList(twosSets)}</ul>
                <div className="winrate"><span>2v2 Match Winrate: {Math.round((brawlProfile.twosMatchWins / (brawlProfile.twosMatchWins + brawlProfile.twosMatchLosses)) * 100)}%</span></div>
            </div>
            <div><span>2v2 Partner: {brawlProfile.partner}</span></div>
            <div><span>Favorite Legend: {brawlProfile.favoriteLegend}</span></div>
            <div><span>Rival(s): {brawlProfile.rival}</span></div>
        </div>
    )
}