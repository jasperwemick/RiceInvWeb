import { useEffect, useState, type RefObject } from "react";
import type { Profile } from "../../../data/types";
import type { TournamentData } from "../createTournamentPage";
import SelectableItemsList from "./selectableItemsList";

interface CreateStartProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss : boolean) => void;
    animInProgress : boolean;
    profiles : Profile[];
}


export default function AddParticipants({ itemRef, transition, animInProgress, profiles } : CreateStartProps) {

    const [participants, setParticipants] = useState<Profile[]>([]);

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Who is participating?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-participants-grid'}>
                    {!animInProgress && 
                    <SelectableItemsList<Profile> 
                    list={profiles} 
                    selection={{ selected : participants, setSelected : setParticipants, multiple : true }} 
                    removalPredicate={(a, b) => a._id != b._id} 
                    getLabel={(x) => x.name}/>}
                </div>
                <button onClick={() => transition({ step : 'AddParticipants', participants : participants }, false)}>Continue</button>
            </div>
        </li>
    )
}
