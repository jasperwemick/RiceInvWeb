import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import "../style/leaguePage.css"
import Placement from "../components/Placement";

const Game = (props) => (
    <li className="game-item">
        <Link to={`/league/games/${props.game.gameNumber}`}>
            <div className="game-info"><span>Game {props.game.gameNumber}</span></div>
            <div className="game-info"><span>Date: {props.game.date.split('T')[0]}</span></div>
        </Link>
    </li>
);

export default function LeaguePage() {

    const [games, setGames] = useState([]);
    const [places, setPlaces] = useState([]);

    const params = useParams();

    useEffect(() => {
        async function getGames() {

            try {
                const responseGames = await fetch(`http://127.0.0.1:4000/api/games/league`);
                const gameList = await responseGames.json();

                const responseLeague = await fetch(`http://127.0.0.1:4000/api/profiles/league`);
                const profileList = await responseLeague.json();

                const responseProfiles = await fetch(`http://127.0.0.1:4000/api/profiles/default`);
                const def = await responseProfiles.json();

                const placements = profileList.map((item) => {
                    const { playerID, placing } = item;
                    const mappedName = [ def.find(x => x._id === playerID).name ]
                    return { mappedName, placing, scores: 3 }
                });
    
                placements.sort((a, b) => {
                    if (a.placing > b.placing) { return 1; }
                    if (a.placing < b.placing) { return -1;}
                    return 0;
                });
                gameList.sort((a, b) => {
                    if (a.gameNumber > b.gameNumber) { return 1; }
                    if (a.gameNumber < b.gameNumber) { return -1;}
                    return 0;
                } )
                setGames(gameList);
                setPlaces(placements)
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                window.alert(message);
                return;
            }
        }

        getGames();
        return;
    }, [games.length]);

    function gameList() {
        return games.map((game) => {
            return (
                <Game 
                    game={game}
                    key={game._id}
                />
            )
        });
    }

    const placingList = () => {
        return places.map((item) => {
            return (
                <Placement
                    placement={item}
                    key={item.mappedName}
                />
            )
        })
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th><span>Placing</span></th>
                        <th><span>Player</span></th>
                        <th><span>RI Points</span></th>
                    </tr>
                </thead>
                <tbody>
                    {placingList()}
                </tbody>
            </table>
            <ul className="game-list">{gameList()}</ul>
        </div>
    )
}