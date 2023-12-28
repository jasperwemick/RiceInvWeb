import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const Game = (props) => (
    <li>
        <div>
            <Link to={`/league/games/${props.game._id}`}>gameLink</Link>
        </div>
        <div>{props.game.gameNumber}</div>
        <div>{props.game.date}</div>
    </li>
);

export default function LeaguePage() {

    const [games, setGames] = useState([])

    const params = useParams();

    useEffect(() => {
        async function getGames() {

            function ascendingOrder(a, b) {
                if (a.gameNumber > b.gameNumber) {
                    return 1;
                }
                if (a.gameNumber < b.gameNumber) {
                    return -1;
                }
                return 0;
            } 

            try {
                const response = await fetch(`http://127.0.0.1:4000/api/games/league`);
                const gameList = await response.json();

                gameList.sort(ascendingOrder)
                setGames(gameList);
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
    return (
        <div>{gameList()}</div>
    )
}