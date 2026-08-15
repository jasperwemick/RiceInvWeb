import { useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";

interface SetTeamsProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss : boolean) => void;
}

export default function SetTeams({ itemRef, transition } : SetTeamsProps) {

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Are there teams?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-button-option'}>
                    <button onClick={() => transition({ nextStep : 'CreateTeams' }, true)}>Yes</button>
                    <button onClick={() => transition({ nextStep : 'SetStages' }, false)}>No</button>
                </div>
            </div>
        </li>
    )
}