import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import "../style/leagueProfile.css"
import moment from "moment"

const Game = (props) => {
    const [gameDropdown, setGameDropdown] = useState(false)

    const toggle = () => {
        setGameDropdown(!gameDropdown)
    }

    return (
        <li className={`list-game ${gameDropdown ? 'list-game-expand': null}`} onClick={() => {toggle(); props.clickEvent();}}>
            <div>
                <Link to={`/league/games/${props.game._id}`}>gameLink</Link>
            </div>
            <div>{props.game.gameNumber}</div>
            <div>{moment(props.game.date).format('MMM Do YYYY')}</div>
            <div className={`${gameDropdown ? null: 'hidden'}`}>
                <h2>Kills: {props.game.kills}</h2>
                <h2>Deaths: {props.game.deaths}</h2>
                <h2>Assists: {props.game.assists}</h2>
                <h3>Champion: {props.game.champion}</h3>
            </div>
        </li>
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
                const responseProfiles = await fetch(`http://127.0.0.1:4000/api/profiles/league/${id}`);
                const profile = await responseProfiles.json();

                // Get list of games player participated in
                const responseLeague = await fetch(`http://127.0.0.1:4000/api/profiles/league/${id}/games`);
                const profileGames = await responseLeague.json();

                // Get list of stas for games
                const responseStats = await fetch(`http://127.0.0.1:4000/api/profiles/league/${id}/games/stats`)
                const stats = await responseStats.json();

                let playerPackage = []
                profileGames.forEach((game) => {
                    const gameStats = stats.find(({ gameID }) => gameID === game._id)
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
                window.alert(message);
                return;
            }
        }

        getLeagueProfile();
        return;
    }, [params.id]);

    function revealStats() {
        
    }

    function gameList() {
        return games.map((game) => {
            return (
                <Game game={game} clickEvent={revealStats} key={game._id}/>
            );
        });
    }

    return (
        <div>
            <div>Placing: {leagueProfile.placing}</div>
            <ul>{gameList()}</ul>
        </div>
    )
}