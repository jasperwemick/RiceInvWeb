import type { RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import GroupTable from "./GroupTable";
import type { GroupActions } from "./SetGroups";
import type { StageGroup } from "../../../data/types";

interface AddTournamentSetsProps {
    itemRef : RefObject<HTMLLIElement>;
    transition : (data : TournamentData, ss ? : { undo : boolean } ) => void;
    animInProgress : boolean;
    subGroup : StageGroup;
    data : TournamentData;
}

export default function AddTournamentSets({ itemRef, transition, animInProgress, subGroup, data } : AddTournamentSetsProps) {

    const removal = () => {
        console.log('1 ', data.subStages);
        const filtered = data.subStages.filter(x => x !== subGroup)
        console.log('2', filtered);
        transition({ nextStep : 'AddTournamentSets', subStages : filtered }, { undo : true })
    }

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <button onClick={removal}>{`X`}</button>
                <p>{subGroup.name}</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    {!animInProgress && <GroupTable groupSize={subGroup.members.length} members={subGroup.members}/>}
                </div>
            </div>
        </li>
    )
}