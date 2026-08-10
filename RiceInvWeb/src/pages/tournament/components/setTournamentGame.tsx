import { useEffect, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import type { Game } from "../../../data/types";
import apiFetch from "../../../util/fetch";


interface SetTournamentGameProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss : boolean) => void;
    animInProgress : boolean;
}

export default function SetTournamentGame({ itemRef, transition, animInProgress } : SetTournamentGameProps) {

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {

        const getGames = async () =>  {
            try {
                const g = await apiFetch<Game[]>('/api/games/');
                setGames(g);
            }
            catch(e) {
                console.log('Failed to fetch: ', e);
            }
        }

        getGames();
    }, []);
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'}>
                <p>Choose a Game</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-button-option'}>
                    <button onClick={() => transition({ step : 'SetTeams' }, true)}>Yes</button>
                    <button onClick={() => transition({ step : 'SetTeams' }, false)}>No</button>
                </div>
            </div>
        </li>
    )
}