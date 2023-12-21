import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Row = ({profile}) => (
    <tr>
        <td>{profile.name}</td>
        <td>{profile.ricePoints}</td>
        <td>{profile.brawlPoints}</td>
        <td>{profile.leaguePoints}</td>
        <td>{profile.valPoints}</td>
        <td>{profile.bullPoints}</td>
        <td>{profile.rocketPoints}</td>
        <td>{profile.mysteryPoints}</td>
        <td>{profile.counterPoints}</td>
        <td>{profile.bonusPoints}</td>
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
                const profileList = await fetch(`http://127.0.0.1:4000/api/profiles`)
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
                <Row
                    profile={profile}
                    key={profile._id}
                />
            );
        });
    }

    return (
        <div className="leaderboard">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total</th>
                        <th>Brawlhalla</th>
                        <th>League of Legends</th>
                        <th>Valorant</th>
                        <th>Bull**** Blast</th>
                        <th>Rocket League</th>
                        <th>???</th>
                        <th>Counter Strike</th>
                        <th>Bonus/Punishment</th>
                    </tr>
                </thead>
                <tbody>{scoresList()}</tbody>
            </table>
        </div>
    )
}