import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const Player = (props) => (
    <li>
        <Link to={`/${props.player.profileID}`}>{props.player.name}</Link>
        <div>{props.player.champion}</div>
        <div>{props.player.kills}</div>
        <div>{props.player.deaths}</div>
        <div>{props.player.assists}</div>
    </li>
);

export default function LeagueGamePage() {
 
    const [players, setPlayers] = useState([]);
    const [names, setNames] = useState([]);
    const [game, setGame] = useState({});

    const params = useParams();

    useEffect(() => {
        async function getPlayerStats() {
            const gid = params.id.toString();

            try {
                const responseGame = await fetch(`http://127.0.0.1:4000/api/games/league/${gid}`);
                const game = await responseGame.json();

                const responseStats = await fetch(`http://127.0.0.1:4000/api/games/league/${gid}/stats`);
                const playerList = await responseStats.json();

                const responseProfiles = await fetch(`http://127.0.0.1:4000/api/games/league/${gid}/profiles/names`);
                const nameList = await responseProfiles.json();
                
                playerList.forEach((item, i) => {
                    let obj = nameList.find(x => x._id == item.profileID)
                    playerList[i].name = obj.name
                });
                setGame(game);
                setPlayers(playerList);
                setNames(nameList);

            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }

        getPlayerStats();
        return;
    }, [params.id, players.length]);

    function gameList() {
        return players.map((player) => {
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
            <div>Game {game.gameNumber}</div>
            <div>{gameList()}</div>
        </div>
    )
}