import { useEffect, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import GroupTable from "./GroupTable";
import type { GroupActions } from "./SetGroups";
import type { StageGroup, TournamentSet } from "../../../data/types";

interface AddTournamentSetsProps {
    itemRef : RefObject<HTMLLIElement>;
    transition : (data : TournamentData, ss ? : { undo : boolean } ) => void;
    animInProgress : boolean;
    subGroup : StageGroup;
    data : TournamentData;
    signal : { action ? : string };
}

export default function AddTournamentSets({ itemRef, transition, animInProgress, subGroup, data, signal } : AddTournamentSetsProps) {

    const [tSets, addTSets] = useState<TournamentSet[]>([]);

    const undo = () => {
        const filteredStages = data.subStages.filter(x => x !== subGroup);
        const filteredSets = data.sets.filter(x => !tSets.includes(x));
        transition({ nextStep : 'AddTournamentSets', subStages : filteredStages, sets : filteredSets }, { undo : true })
    }

    useEffect(() => {
        transition({ nextStep : '', sets : [...(data.sets ? data.sets : []), ...tSets]})
    }, [tSets])

    useEffect(() => {
        if (!signal) return;
        if (signal.action === 'undo') undo();
    }, [signal])

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <button onClick={undo}>{`X`}</button>
                <p>{subGroup.name}</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    {!animInProgress && <GroupTable groupSize={subGroup.members.length} members={subGroup.members} setSets={addTSets} interactive={true}/>}
                </div>
            </div>
        </li>
    )
}