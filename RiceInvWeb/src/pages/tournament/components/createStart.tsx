import { useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";

interface CreateStartProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss : boolean) => void;
}

export default function CreateStart({ itemRef, transition } : CreateStartProps) {

    const [inputText, setInputText] = useState<string>('');

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Enter a name for the tournament</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <input value={inputText} onChange={e => setInputText(e.target.value)}/>
                <button onClick={() => transition({ step : 'CreateStart', name : inputText }, false)}>Continue</button>
            </div>
        </li>
    )
}