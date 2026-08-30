import { useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";

interface SetTeamsProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    data : TournamentData
}

export default function SetTeams({ itemRef, dispatcher, data } : SetTeamsProps) {
    
    const undo = () => {
        dispatcher({
            type : 'UNDO_STEP',
            data : { }
        })
    }

    const submit = (choice : string) => {
        if (choice === 'Y') dispatcher({type : 'SIDESTEP', data : {}, ss : 'CreateTeams'});
        else dispatcher({type : 'STEP', data : { step : 'SetStages' }});
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'} >
                <p>Are there teams?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-button-option'}>
                    <button onClick={() => submit('Y')}>Yes</button>
                    {data.gameMode.teamSize < 2 && <button onClick={() => submit('N')}>No</button>}
                </div>
            </div>
        </li>
    )
}