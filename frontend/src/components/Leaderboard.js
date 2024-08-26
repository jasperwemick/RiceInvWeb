import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/scoreboard.css"
import ProfileContext from "./Profile/context/ProfileContextProvider";
import useProfiles from "./Profile/hooks/useProfiles";

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

    const { profiles, setProfiles } = useContext(ProfileContext)

    useProfiles()
 
    function scoresList() {

        function descendingOrder(a, b) {
            if (a.ricePoints > b.ricePoints) {
                return -1;
            }
            if (a.ricePoints < b.ricePoints) {
                return 1;
            }
            return 0;
        } 

        return profiles.sort(descendingOrder).map((profile) => {
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