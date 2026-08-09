import { useState, type RefObject } from "react";

interface SetTeamsData {
    participantType : 'Profile' | 'Team';
}

interface SetTeamsProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : SetTeamsData) => void;
}

export default function SetTeams({ itemRef, transition } : SetTeamsProps) {

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Are there teams?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div>
                    <button onClick={() => transition({ participantType : 'Team' })}>Yes</button>
                    <button onClick={() => transition({ participantType : 'Profile' })}>No</button>
                </div>
            </div>
        </li>
    )
}