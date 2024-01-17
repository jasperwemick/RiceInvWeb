import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "../style/leagueProfile.css"
import GetUrl from "../GetUrl";

const Game = (props) => {
    const [gameDropdown, setGameDropdown] = useState(false)

    const toggle = () => {
        setGameDropdown(!gameDropdown)
    }

    return (
        <React.Fragment>
            <li className={`list-game ${props.game.winner ? 'winner-game': 'loser-game'}`} onClick={() => {toggle();}}>
                <div>
                    <Link to={`/league/games/${props.game.gameNumber}`}>gameLink</Link>
                </div>
                <div>{props.game.gameNumber}</div>
                <div>{props.game.date.split('T')[0]}</div>
            </li>
            <li>
                <div className={`${gameDropdown ? 'list-details-expand-league': 'list-details-shrink-league'}`}>
                    <div className={`stats-content ${gameDropdown ? '': 'hidden'}`}>
                        <span>Kills: {props.game.kills}</span>
                        <span>Deaths: {props.game.deaths}</span>
                        <span>Assists: {props.game.assists}</span>
                        <span>Champion: {props.game.champion}</span>
                    </div>
                </div>
            </li>
        </React.Fragment>
    )
};

export default function LeagueProfilePage() {
 
    const [leagueProfile, setLeagueProfile] = useState({})
    const [games, setGames] = useState([])

    const params = useParams();

    useEffect(() => {
        async function getLeagueProfile() {
            const id = params.id.toString();

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
                // Get League related profile data
                const responseProfiles = await fetch(`${GetUrl}/api/profiles/league/${id}`);
                const profile = await responseProfiles.json();

                // Get list of games player participated in
                const responseLeague = await fetch(`${GetUrl}/api/profiles/league/${id}/games`);
                const profileGames = await responseLeague.json();

                // Get list of stas for games
                const responseStats = await fetch(`${GetUrl}/api/profiles/league/${id}/games/stats`)
                const stats = await responseStats.json();

                let playerPackage = []
                profileGames.forEach((game) => {
                    const gameStats = stats.find(({ gameID }) => gameID === game._id);
                    playerPackage.push({
                        ...gameStats,
                        ...game
                    })
                });

                playerPackage.sort(ascendingOrder);

                setLeagueProfile(profile);
                setGames(playerPackage);

            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message);
                return;
            }
        }

        getLeagueProfile();
        return;
    }, [params.id]);

    function gameList() {
        return games.map((game) => {
            return (
                <Game game={game} key={game._id}/>
            );
        });
    }

    return (
        <div>
            <div><span>Placing: {leagueProfile.placing}</span></div>
            <ul className="game-list">{gameList()}</ul>
            <div><span>Rating 1.0: {leagueProfile.rating}</span></div>
        </div>
    )
}