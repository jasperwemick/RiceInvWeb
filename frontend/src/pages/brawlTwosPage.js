import React, { useState, useEffect } from "react";
import "../style/brawlPage.css"
import { GroupSet, GroupTable } from "../components/Bracket/bracket.js"
import GetUrl from "../GetUrl.js";
import { GenerateBracket } from "../components/Bracket/GenerateBracket.js";


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
                const responseSets = await fetch(`${GetUrl}/api/games/brawl/twos`)
                const gamePackage = await responseSets.json();
                gamePackage.sort(ascendingOrder)

                const responseStats = await fetch(`${GetUrl}/api/games/brawl/twos/stats`)
                const stats = await responseStats.json();

                const responseProfiles = await fetch(`${GetUrl}/api/profiles/default`)
                const profiles = await responseProfiles.json();

                const responseBrawl = await fetch(`${GetUrl}/api/profiles/brawl`)
                const brawlProfiles = await responseBrawl.json();

                gamePackage.forEach((item, i) => {
                    let set = stats.filter(x => x.setID === item._id);

                    const winnersStats = set.filter(x => x.winner === true);
                    let winnerProfile = profiles.find(x => x._id === winnersStats[0].profileID);
                    let winnerProfileTwo = profiles.find(x => x._id === winnersStats[1].profileID);
                    gamePackage[i].winnerStats = winnersStats[0];
                    gamePackage[i].winnerStats.names = [winnerProfile.name, winnerProfileTwo.name];

                    const losersStats = set.filter(x => x.winner === false);
                    let loserProfile = profiles.find(x => x._id === losersStats[0].profileID);
                    let loserProfileTwo = profiles.find(x => x._id === losersStats[1].profileID);
                    gamePackage[i].loserStats = losersStats[0];
                    gamePackage[i].loserStats.names = [loserProfile.name, loserProfileTwo.name];

                    let winnerBrawl = brawlProfiles.find(x => x.playerID === winnerProfile._id);
                    let loserBrawl = brawlProfiles.find(x => x.playerID === loserProfile._id);
                    item.parents.forEach((parent) => {
                        const parentSet = gamePackage.find(x => x.setNumber === parent);
                        if (winnerBrawl.sets.includes(parentSet.setNumber)) {
                            gamePackage[i].winnerStats.prevSet = {setNumber: parentSet.setNumber, formatType: parentSet.formatType, details: parentSet.details}
                        }
                        if (loserBrawl.sets.includes(parentSet.setNumber)){
                            gamePackage[i].loserStats.prevSet = {setNumber: parentSet.setNumber, formatType: parentSet.formatType, details: parentSet.details}
                        }
                    })
                    // console.log(item)
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
                console.log(message);
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
            <h3>GROUPS</h3>
            <GroupTable listFunc={mapList(groupSets, GroupSet, 0, 6)} groupName={"Group A"}/>
            <GroupTable listFunc={mapList(groupSets, GroupSet, 6, 12)} groupName={"Group B"}/>
            <h3>GAUNTLET</h3>
            <div>
            <GenerateBracket type={'Double'} numPlayers={14} format={'full'} gameTag={'brawlhalla-allstar-qualifier'}/>
            </div>
        </div>
    )
}