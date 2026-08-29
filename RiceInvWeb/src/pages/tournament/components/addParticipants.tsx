import { useEffect, useState, type RefObject } from "react";
import type { Profile } from "../../../data/types";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";

interface CreateStartProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    profiles : Profile[]; 
    data : TournamentData
}


export default function AddParticipants({ itemRef, dispatcher, animInProgress, profiles, data } : CreateStartProps) {

    const [participants, setParticipants] = useState<Profile[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const submit = () => {
        if (participants.length % data.gameMode.teamSize === 0) {
            dispatcher({
                type : 'STEP',
                data : {
                    step : 'SetTeams',
                    participants : participants, 
                    particpantType : 'Profile' 
                }
            })
        }
        else {
            setErrorMsg(`Participants must evenly distribute for teams of size ${data.gameMode.teamSize}`)
        }
    }

    const undo = () => {
        dispatcher({ type: 'UNDO_STEP', data : { participants : participants }});
    }

    useEffect(() => {
        setErrorMsg('');
    }, [participants])

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
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
                {participants.length >= 2 && <button onClick={submit}>Continue</button>}
            </div>
        </li>
    )
}
