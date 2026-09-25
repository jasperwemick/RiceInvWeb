import { useState, useEffect } from "react";
import "../../style/brawlPage.css"
// import { Link } from "wouter";
import apiFetch from "../../util/fetch";
import type { FlatGameProfile, Game } from "../../data/types";
// import ProfileRanks from "./components/ProfileRanks";


export default function RankingsPage() {

    // const [brawlProfiles, setBrawlProfiles] = useState([])
    const [game, setGame] = useState<Game>({
        _id: '',
        name : 'Brawl',
        fullName : 'Brawlhalla',
        description : '',
        gameModes : []
    });
    const [profiles, setProfiles] = useState<FlatGameProfile[]>([])

    useEffect(() => {
        // Ranking is based on the individual's performance ranking.
        // Placing is based on the team's performance in a tournament.
        // Objectives:
        // 1) Have a ranking list for each game mode
        // 2) Have a list of tournaments for Brawl
        // 3) For each tournament, show team placings. Happens when clicked
        // 4) More details button to show Tournament Bracket, and groups/gauntlet
        const getRanking = async () => {
            try {
                const gameData = await apiFetch<Game>(`/api/games/name/${game.name}`);
                const brawlProfileData = await apiFetch<FlatGameProfile[]>(`api/profiles/game/${game.name}`)
                setProfiles(brawlProfileData);
                setGame(gameData);
                console.log(profiles);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message)
                return;
            }
        }
        getRanking();
    }, [game.name]);

    // const onChangeGame = () => {

    // }

    // const listGames = () => {
    //     return game.gameModes.map((mode, index) => {
    //         return (
    //             <ProfileRanks profiles={profiles} mode={mode} key={index}/>
    //         );
    //     });
    // }

    return (
        <div>
            <div>{'WIP'}</div>
            {/* <div onClick={onChangeGame}></div>
            <div><span>{game.fullName}</span></div>
            <div><span>{game.description}</span></div>
            {listGames()} */}
        </div>
    )
}