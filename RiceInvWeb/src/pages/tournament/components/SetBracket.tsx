import { useEffect, useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { TournamentParticipant, TournamentSet, TournamentStage } from "../../../data/types";
import { GenerateBracket } from "../../../components/Bracket/GenerateBracket";
import { ObjectId } from "bson";

interface SetPlayoffsProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    stageNum : number;
    data : TournamentData;
    participants : TournamentParticipant[];
}

export default function SetBracket({itemRef, dispatcher, stageNum, data, participants} : SetPlayoffsProps) {
    
    const [numPlayers] = useState(participants.length);
    const [stage, setStage] = useState<TournamentStage | null>(null);
    // const [brackets, setBrackets] = useState<TournamentSubStage[]>([]);
    const [sets, setSets] = useState<TournamentSet[]>([]);

    const undo = () => {
        dispatcher({
            type : 'UNDO_STEP',
            data : {},
            isStage : true
        })
    }

    // const submit = () => {

    // }

    useEffect(() => {
        if (data.stages) {
            setStage(data.stages.find(x => x.order === stageNum) ?? null)
        }
    }, [data]);

    useEffect(() => {
        console.log(participants);
    }, [numPlayers])
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <button onClick={undo}>Back</button>
            <div className={'tournament-configuration-box-header'} >
                <p>Set the Playoff Bracket</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                {stage ? 
                <GenerateBracket 
                stage={stage} 
                subStage={{
                    id : new ObjectId().toHexString(),
                    order : 0,
                    stage : stage?.order,
                    name : '',
                    format : stage?.format,
                    members : participants,
                    subType : 'Sets',
                    qualificationSlots : 1
                }}
                players={participants} 
                sets={sets}
                setSets={setSets}/> : 
                <></>}
            </div>
        </li>
    )
}