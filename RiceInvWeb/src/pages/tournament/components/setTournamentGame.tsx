import { useEffect, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import type { Game } from "../../../data/types";
import apiFetch from "../../../util/fetch";
import SelectableItemsList from "./selectableItemsList";
import ListImageItem from "./listImageItem";


interface SetTournamentGameProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss : boolean) => void;
    animInProgress : boolean;
}

export default function SetTournamentGame({ itemRef, transition, animInProgress } : SetTournamentGameProps) {

    const [games, setGames] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game[]>([]);

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
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-participants-grid'}>
                        {!animInProgress && 
                        <SelectableItemsList<Game>
                        list={games} 
                        selected={selectedGame} 
                        setSelected={setSelectedGame} 
                        limit={1}
                        ComponentItem={ListImageItem}
                        removalPredicate={(a, b) => (a.name != b.name)}
                        getLabel={(x) => x.fullName}
                        ExtraProps={{ getImgSrc : (x : Game) => '/', imgWidth : 100, imgHeight : 100 }}/>}
                    </div>
                </div>
            </div>
            <button onClick={() => transition({step : 'SetGame'}, false)}>Continue</button>
        </li>
    )
}