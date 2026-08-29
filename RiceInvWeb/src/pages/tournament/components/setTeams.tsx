import { useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";

interface SetTeamsProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    data : TournamentData
}

export default function SetTeams({ itemRef, dispatcher, data } : SetTeamsProps) {
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Are there teams?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-button-option'}>
                    <button onClick={() => dispatcher({type : 'SIDESTEP', data : {step: 'CreateTeams' }})}>Yes</button>
                    {data.gameMode.teamSize < 2 && <button onClick={() => dispatcher({type : 'STEP', data : { step : 'SetStages' }})}>No</button>}
                </div>
            </div>
        </li>
    )
}