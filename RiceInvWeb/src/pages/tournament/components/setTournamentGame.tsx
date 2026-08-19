import { useEffect, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import type { Game, GameMode } from "../../../data/types";
import apiFetch from "../../../util/fetch";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import ListImageItem from "../../../components/SelectableList/listImageItem";


interface SetTournamentGameProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss ? : { undo : boolean }) => void;
    animInProgress : boolean;
}

export default function SetTournamentGame({ itemRef, transition, animInProgress } : SetTournamentGameProps) {

    const [games, setGames] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);

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

    useEffect(() => {
        setSelectedGameMode(null);
    }, [selectedGame])

    const submitGame = () => {
        if (!selectedGameMode) return;
        transition({nextStep : 'AddParticipants', gameMode : selectedGameMode});
    }

    
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
                        selection={{selected : selectedGame, setSelected : setSelectedGame, multiple : false}}
                        removalPredicate={(a, b) => (a.name != b.name)}
                        getLabel={(x) => x.fullName}
                        ComponentItem={ListImageItem}
                        ExtraProps={{ getImgSrc : (x : Game) => '/', imgWidth : '6rem', imgHeight : '6rem' }}/>}
                    </div>
                </div>
                {selectedGame && 
                <div className={'tournament-configuration-subbox'}>
                    <div className={'tournament-item-list'}>
                    {!animInProgress && 
                    <SelectableItemsList<GameMode>
                    list={selectedGame?.gameModes} 
                    selection={{selected : selectedGameMode, setSelected : setSelectedGameMode, multiple : false}}
                    removalPredicate={(a, b) => (a.mode != b.mode)}
                    getLabel={(x) => x.mode}/>}
                    </div>
                </div>}
                <button onClick={submitGame}>Continue</button>
            </div>
        </li>
    )
}