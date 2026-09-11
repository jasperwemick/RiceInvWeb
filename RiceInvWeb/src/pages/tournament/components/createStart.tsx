import { useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";

interface CreateStartProps {
    itemRef : RefObject<HTMLLIElement>;
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
}

export default function CreateStart({ itemRef, dispatcher } : CreateStartProps) {

    const [inputText, setInputText] = useState<string>('');

    const undo = () => {
        dispatcher({ type: 'UNDO_STEP', data : {}});
    }
    
    const submitName = () => {
        if (inputText.length < 3) return;
        dispatcher({ type : 'STEP', data : { step : 'SetGame', name : inputText }});
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'} >
                <p>Enter a name for the tournament</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <input value={inputText} onChange={e => setInputText(e.target.value)}/>
                <button onClick={submitName}>Continue</button>
            </div>
        </li>
    )
}