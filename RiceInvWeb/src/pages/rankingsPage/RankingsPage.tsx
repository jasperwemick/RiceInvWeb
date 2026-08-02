import React, { useState, useEffect, useContext } from "react";
import "../../style/brawlPage.css"
import { Link } from "wouter";
import apiFetch from "../../util/fetch";
import type { FlatGameProfile, Game } from "../../data/types";
import ProfileRanks from "./components/ProfileRanks";


export default function RankingsPage() {

    // const [brawlProfiles, setBrawlProfiles] = useState([])
    const [game, setGame] = useState<Game>({
        _id: '',
        name : 'brawl',
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
                const gameData = await apiFetch<Game>(`/game/${game.name}`);
                const brawlProfileData = await apiFetch<FlatGameProfile[]>(`/profile/game-profile/${game.name}`)
                setProfiles(brawlProfileData);
                setGame(gameData);
            }
            catch(err) {
                const message = `An error occurred: ${err}`;
                console.log(message)
                return;
            }
        }
        getRanking();
        return;
    }, [game]);

    const onChangeGame = () => {

    }

    const listGames = () => {
        return game.gameModes.map((mode) => {
            return (
                <ProfileRanks profiles={profiles} mode={mode}/>
            );
        });
    }

    return (
        <div>
            <div onClick={onChangeGame}></div>
            <div><span>Brawlhalla</span></div>
            <div><span>Brawlhalla is a Premiere game in the Rice Invitational</span></div>
            {listGames()}
            <div className="ones-block">
                <div className="brawl-button"><Link to='/brawl/ones'>Singles</Link></div>
            </div>
            <div className="twos-block">
                <div className="brawl-button"><Link to='/brawl/twos'>Doubles</Link></div>
            </div>
        </div>
    )
}