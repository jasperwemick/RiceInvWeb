import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "../style/brawlPage.css"
import { GroupSet, GroupTable, GauntletSet, GauntletBracket, PlayoffSet, PlayoffColumn } from "../components/bracket.js"
import { UpperBrawlTwos, LowerBrawlTwos, BracketBrawlTwos } from "../components/bracketStructure.js";


export default function BrawlTwosPage() {
    const [groupSets, setGroupSets] = useState([]);
    const [gauntletSets, setGauntletSets] = useState([]);
    const [upperPlayoffSets, setUpperPlayoffSets] = useState([]);
    const [lowerPlayoffSets, setLowerPlayoffSets] = useState([]);

    useEffect(() => {
        async function getData() {

            function ascendingOrder(a, b) {
                if (a.setNumber > b.setNumber) {
                    return 1;
                }
                if (a.setNumber < b.setNumber) {
                    return -1;
                }
                return 0;
            } 

            try {
                const responseSets = await fetch(`http://127.0.0.1:4000/api/games/brawl/twos`)
                const gamePackage = await responseSets.json();
                gamePackage.sort(ascendingOrder)

                const responseStats = await fetch(`http://127.0.0.1:4000/api/games/brawl/twos/stats`)
                const stats = await responseStats.json();

                const responseProfiles = await fetch(`http://127.0.0.1:4000/api/profiles`)
                const profiles = await responseProfiles.json();

                gamePackage.forEach((item, i) => {
                    let set = stats.filter(x => x.setID === item._id);

                    const winnersStats = set.filter(x => x.winner === true);
                    const losersStats = set.filter(x => x.winner === false);
                    

                    let winner = profiles.find(x => x._id === winnersStats[0].profileID).name;
                    winner += '/' + profiles.find(x => x._id === winnersStats[1].profileID).name;
                    let loser = profiles.find(x => x._id === losersStats[0].profileID).name;
                    loser += '/' + profiles.find(x => x._id === losersStats[1].profileID).name;

                    gamePackage[i].winnerName = winner;
                    gamePackage[i].loserName = loser;
                    gamePackage[i].winnerStats = winnersStats[0];
                    gamePackage[i].loserStats = losersStats[0];
                });

                const groups = gamePackage.filter(x => x.formatType === 'Group')
                const gauntlet = gamePackage.filter(x => x.formatType === 'Gauntlet')
                const uppers = gamePackage.filter(x => x.formatType === 'Uppers')
                const lowers = gamePackage.filter(x => x.formatType === 'Lowers')

                setGroupSets(groups);
                setGauntletSets(gauntlet);
                setUpperPlayoffSets(uppers);
                setLowerPlayoffSets(lowers);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }

        getData();
        return;
    }, [groupSets.length]);

    function mapList(state, Component, a, b) {
        return state.slice(a, b).map((set) => {
            return (
                <Component
                    set={set}
                    key={set._id}
                />
            );
        });
    }

    return (
        <div>
            <section>
                <h3>GROUPS</h3>
                <GroupTable listFunc={mapList(groupSets, GroupSet, 0, 6)} groupName={"Group A"}/>
                <GroupTable listFunc={mapList(groupSets, GroupSet, 6, 12)} groupName={"Group B"}/>
            </section>
            <section>
                <h3>GAUNTLET</h3>
                <div className="gauntlet">
                    <BracketBrawlTwos sets={gauntletSets}/>
                </div>
            </section>
            <section>
                <h3>PLAYOFFS</h3>
                <div className="playoffs">
                    <UpperBrawlTwos sets={upperPlayoffSets}/>
                </div>
            </section>
            <section>
                <div className="playoffs">
                    <LowerBrawlTwos sets={lowerPlayoffSets}/>
                </div>
            </section>
        </div>
    )
}