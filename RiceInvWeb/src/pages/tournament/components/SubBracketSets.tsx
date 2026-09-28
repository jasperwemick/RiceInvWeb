import { useEffect, useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { TournamentSubStage, TournamentSet, TournamentStage } from "../../../data/types";
import { GenerateBracket } from "../../../components/Bracket/GenerateBracket";

interface BracketSideStepProps {
    itemRef : RefObject<HTMLLIElement>;
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    order : number;
    subStage : TournamentSubStage;
    data : TournamentData;
    signal : { action ? : string };
}

export default function SubBracketSets({ itemRef, dispatcher, order, subStage, data, signal } : BracketSideStepProps) {

    const [tSets, addTSets] = useState<TournamentSet[]>(data.sets ? data.sets.filter(x => x.subStageId === subStage.id) : []);
    const [slots] = useState<number>(subStage.qualificationSlots ? subStage.qualificationSlots : 0);
    const [stage, setStage] = useState<TournamentStage | null>(null);


    const undo = () => {
        dispatcher({ 
            type : 'UNDO_SIDESTEP',
            data : { subStages : [subStage], sets : tSets },
            ss : `SubBracketSets-${subStage.stage}-${order}`,
            index : order
        });
    }

    const submit = () => {
        const cachedSubStage = data.subStages.find(x => x.id === subStage.id);
        if (!cachedSubStage) {
            // Throw some error
            return;
        }
        const stg : TournamentSubStage = { ...cachedSubStage, qualificationSlots : slots};
        dispatcher({ type : 'SUBMIT_SIDESTEP', data : { subStages : [stg], sets : tSets }, ss : `SubGroupsSets-${subStage.stage}-${order}` });
    }

    useEffect(() => {
        setStage(data.stages.find(x => x.order === subStage.stage) ?? null);
    }, [data.stages.length]);

    useEffect(() => {
        if (!signal) return;
        if (signal.action === 'undo') undo();
        if (signal.action === 'submit') submit();
    }, [signal]);

    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'}>
                <p>{subStage.name}</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                <div className={'tournament-configuration-subbox'}>
                    {stage ? 
                    <GenerateBracket 
                    stage={stage} 
                    subStage={subStage}
                    players={subStage.members} 
                    sets={tSets}
                    setSets={addTSets}/> : <></>}
                </div>
            </div>
        </li>
    )
}