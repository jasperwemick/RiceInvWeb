import { useState, type RefObject } from "react";

export default function CreateTeams({ itemRef, transition } : CreateStartProps) {

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