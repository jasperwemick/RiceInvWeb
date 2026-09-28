import type { RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";

interface ReviewProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    data : TournamentData
}

export default function TournamentReview({ itemRef } : ReviewProps) {

    const undo = () => {

    }

    // const submit = () => {
        
    // }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'}>
                <p>Who is participating?</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-participants-grid'}>
                </div>
            </div>
        </li>
    )
}