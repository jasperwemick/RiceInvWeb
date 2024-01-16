import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/scoreboard.css"

const LeaderboardRow = ({profile}) => (
    <tr className="leaderboard-row">
        <td><Link to={`/${profile._id}`}>{profile.name}</Link></td>
        <td><span>{profile.ricePoints}</span></td>
        <td><Link to={`/brawl/${profile._id}`}>{profile.brawlPoints}</Link></td>
        <td><Link to={`/league/${profile._id}`}>{profile.leaguePoints}</Link></td>
        <td><span>{profile.valPoints}</span></td>
        <td><span>{profile.bullPoints}</span></td>
        <td><span>{profile.rocketPoints}</span></td>
        <td><span>{profile.mysteryPoints}</span></td>
        <td><span>{profile.counterPoints}</span></td>
        <td><span>{profile.bonusPoints}</span></td>
    </tr>
);

export default function Leaderboard() {

    const [profiles, setProfiles] = useState([]);
 
    // This method fetches the jobs from the database.
    useEffect(() => {
        async function getProfiles() {

            function descendingOrder(a, b) {
                if (a.ricePoints > b.ricePoints) {
                    return -1;
                }
                if (a.ricePoints < b.ricePoints) {
                    return 1;
                }
                return 0;
            } 

            try {
                const profileList = await fetch(`http://127.0.0.1:4000/api/profiles/default`)
                const p = await profileList.json();
                p.sort(descendingOrder);
                setProfiles(p);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }
        
        getProfiles();
        return;
    }, [profiles.length]);
 
    // This method will map out the jobs on the table
    function scoresList() {
        return profiles.map((profile) => {
            return (
                <LeaderboardRow
                    profile={profile}
                    key={profile._id}
                />
            );
        });
    }

    return (
        <section className="leaderboard">
            <table>
                <thead>
                    <tr className="leaderboard-header">
                        <th><span>Player</span></th>
                        <th><span>Total</span></th>
                        <th><Link to={`/brawl`}>Brawlhalla</Link></th>
                        <th><Link to={`/league`}>League of Legends</Link></th>
                        <th><span>Valorant</span></th>
                        <th><span>Bull**** Blast</span></th>
                        <th><span>Rocket League</span></th>
                        <th><span>???</span></th>
                        <th><span>Counter Strike</span></th>
                        <th><span>Bonus/Punishment</span></th>
                    </tr>
                </thead>
                <tbody>{scoresList()}</tbody>
            </table>
        </section>
    )
}