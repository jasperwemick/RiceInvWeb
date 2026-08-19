import { useEffect, useState, type RefObject } from "react";
import type { Profile } from "../../../data/types";
import type { TournamentData } from "../createTournamentPage";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";

interface CreateStartProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss ? : { undo : boolean }) => void;
    animInProgress : boolean;
    profiles : Profile[]; 
    data : TournamentData
}


export default function AddParticipants({ itemRef, transition, animInProgress, profiles, data } : CreateStartProps) {

    const [participants, setParticipants] = useState<Profile[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const submit = () => {
        if (participants.length % data.gameMode.teamSize === 0) {
            transition({ nextStep : 'SetTeams', participants : participants })
        }
        else {
            setErrorMsg(`Participants must evenly distribute for teams of size ${data.gameMode.teamSize}`)
        }
    }

    useEffect(() => {
        setErrorMsg('');
    }, [participants])

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
                {errorMsg !== '' && <p style={{ color : '#fd3b3bff' }}>{errorMsg}</p>}
                <button onClick={submit}>Continue</button>
            </div>
        </li>
    )
}
