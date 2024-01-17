import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "../style/leagueGame.css"
import GetUrl from "../GetUrl";

const Player = (props) => (
    <li className={`game-list-item ${props.player.subbed ? 'league-subbed': ''}`} >
        <Link to={`/${props.player.profileID}`}>{props.player.name}</Link>
        <div><span>Champion: {props.player.champion}</span></div>
        <div><span>Kills: {props.player.kills}</span></div>
        <div><span>Deaths: {props.player.deaths}</span></div>
        <div><span>Assists: {props.player.assists}</span></div>
        <div><span>Rating: {props.player.rating}</span></div>
    </li>
);

export default function LeagueGamePage() {
 
    const [winners, setWinners] = useState([]);
    const [losers, setLosers] = useState([]);
    const [game, setGame] = useState({});

    const [hasNextGame, setHasNextGame] = useState(false);
    const [hasPrevGame, setHasPrevGame] = useState(false);

    const params = useParams();

    useEffect(() => {
        async function getPlayerStats() {
            const num = params.num;

            try {
                const responseGame = await fetch(`${GetUrl}/api/games/league/${num}`);
                const game = await responseGame.json();

                const responseStats = await fetch(`${GetUrl}/api/games/league/${num}/stats`);
                const playerList = await responseStats.json();

                const responseProfiles = await fetch(`${GetUrl}/api/games/league/${num}/profiles/names`);
                const nameList = await responseProfiles.json();
                
                playerList.forEach((item, i) => {
                    let obj = nameList.find(x => x._id === item.profileID);
                    playerList[i].name = obj.name;
                });

                const win = playerList.filter(x => x.winner === true)
                const lose = playerList.filter(x => x.winner === false)

                setHasNextGame(game.gameNumber === 7 ? false : true)
                setHasPrevGame(game.gameNumber === 1 ? false : true)
                setWinners(win)
                setLosers(lose)
                setGame(game);

            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message);
                return;
            }
        }

        getPlayerStats();
        return;
    }, [params.num]);

    function teamList(state) {
        return state.map((player) => {
            return (
                <Player
                    player={player}
                    key={player._id}
                />
            );
        });
    }

    return (
        <div>
            <div className={`league-nav ${hasPrevGame ? '': 'hidden'}`}>
                <Link to={`/league/games/${(game.gameNumber - 1).toString()}`}>Game {game.gameNumber - 1}</Link>
            </div>
            <div className={`league-nav ${hasNextGame ? '': 'hidden'}`}>
                <Link to={`/league/games/${(game.gameNumber + 1).toString()}`}>Game {game.gameNumber + 1}</Link>
            </div>
            <div><span>Game {game.gameNumber}</span></div>
            <div className="team-group">
                <div className="team-group-header"><span>Win</span></div>
                <ul className="game-list">{teamList(winners)}</ul>
            </div>
            <div className="team-group">
                <div className="team-group-header"><span>Loss</span></div>
                <ul className="game-list">{teamList(losers)}</ul>
            </div>
        </div>
    )
}