import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const scoreRow = ({profile, score}) => (
    <tr>
        <td>{profile.name}</td>
        <td>{profile.ricePoints}</td>
        <td>{score.brawlPoints}</td>
        <td>{score.leaguePoints}</td>
        <td>{score.valPoints}</td>
        <td>{score.bullPoints}</td>
        <td>{score.rocketPoints}</td>
        <td>{score.mysteryPoints}</td>
        <td>{score.counterPoints}</td>
        <td>{score.bonusPoints}</td>
    </tr>
);

export default function Leaderboard() {

    useEffect(() => {
        
    });

    return (
        <div className="leaderboard">

        </div>
    )
}