import { useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";

interface SetTeamsProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss ? : { undo : boolean }) => void;
    data : TournamentData
}

export default function SetTeams({ itemRef, transition, data } : SetTeamsProps) {
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Are there teams?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-button-option'}>
                    <button onClick={() => transition({ nextStep : 'CreateTeams' }, { undo : false })}>Yes</button>
                    {data.gameMode.teamSize < 2 && <button onClick={() => transition({ nextStep : 'SetStages' })}>No</button>}
                </div>
            </div>
        </li>
    )
}