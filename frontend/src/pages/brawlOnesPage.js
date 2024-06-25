import React, { useState, useEffect } from "react";
import "../style/brawlPage.css"
import { GroupSet, GroupTable} from "../components/bracket.js"
import { GauntletBrawl, UpperBrawlOnes, LowerBrawlOnes } from "../components/bracketStructure.js"
import GetUrl from "../GetUrl.js";
import { GenerateBracket } from "../components/GenerateBracket.js";

export default function BrawlOnesPage() {
    const [groupSets, setGroupSets] = useState([]);
    const [gauntletSets, setGauntletSets] = useState([]);
    const [upperPlayoffSets, setUpperPlayoffSets] = useState([]);
    const [lowerPlayoffSets, setLowerPlayoffSets] = useState([]);

    const [numPlayers, setNumPlayers] = useState(8);

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
                const responseSets = await fetch(`${GetUrl}/api/games/brawl/ones`)
                const gamePackage = await responseSets.json();
                gamePackage.sort(ascendingOrder)

                const responseStats = await fetch(`${GetUrl}/api/games/brawl/ones/stats`)
                const stats = await responseStats.json();

                const responseProfiles = await fetch(`${GetUrl}/api/profiles/default`)
                const profiles = await responseProfiles.json();

                const responseBrawl = await fetch(`${GetUrl}/api/profiles/brawl`)
                const brawlProfiles = await responseBrawl.json();

                gamePackage.forEach((item, i) => {
                    let set = stats.filter(x => x.setID === item._id);

                    let winnerStats = set.find(x => x.winner === true);
                    let winnerProfile = profiles.find(x => x._id === winnerStats.profileID);
                    gamePackage[i].winnerStats = winnerStats;
                    gamePackage[i].winnerStats.names = [winnerProfile.name];

                    let loserStats = set.find(x => x.winner === false);
                    let loserProfile = profiles.find(x => x._id === loserStats.profileID);
                    gamePackage[i].loserStats = loserStats;
                    gamePackage[i].loserStats.names = [loserProfile.name];

                    let winnerBrawl = brawlProfiles.find(x => x.playerID === winnerStats.profileID);
                    item.parents.forEach((parent) => {
                        const parentSet = gamePackage.find(x => x.setNumber === parent);
                        if (winnerBrawl.sets.includes(parentSet.setNumber)) {
                            gamePackage[i].winnerStats.prevSet = {setNumber: parentSet.setNumber, formatType: parentSet.formatType, details: parentSet.details}
                        }
                        else {
                            gamePackage[i].loserStats.prevSet = {setNumber: parentSet.setNumber, formatType: parentSet.formatType, details: parentSet.details}
                        }
                    })
                    console.log(item)
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
    }, []);

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
                <GroupTable listFunc={mapList(groupSets, GroupSet, 12, 18)} groupName={"Group C"}/>
                <GroupTable listFunc={mapList(groupSets, GroupSet, 18, 24)} groupName={"Group D"}/>
            </section>
            <section>
                <h3>GAUNTLET</h3>
                <div className="gauntlet">
                    <GauntletBrawl sets={gauntletSets}/>
                </div>
            </section>
            <section>
                <GenerateBracket type={'Double'} numPlayers={numPlayers} format={'full'}/>
            </section>
        </div>
    )
}