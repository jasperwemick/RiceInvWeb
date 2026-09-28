import { useEffect, useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { TournamentParticipant, TournamentStage, TournamentSubStage } from "../../../data/types";
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
    const [brackets, setBrackets] = useState<TournamentSubStage[]>([]);

    const undo = () => {
        dispatcher({
            type : 'UNDO_STEP',
            data : {},
            activeSSCount : brackets.length, 
            isStage : true
        })
    }

    // const getParticipants = () => {
    //     return participants.filter(x => isParticipantAvailable(x));
    // }

    const confirmBracket = () => {
        if (!stage) return;
        
        setBrackets([...brackets, {
            id : new ObjectId().toHexString(),
            order : brackets.length,
            stage : stageNum,
            name : '',
            format : stage.format,
            subType : 'Sets',
            members : participants,
        }]);
    }

    useEffect(() => {
        if (brackets.length > (data.subStages.filter(x => x.stage === stageNum).length)) {
            dispatcher({type : 'SIDESTEP', data : { subStages : brackets }, ss: `SubBracketSets-${stageNum}-${brackets.length - 1}`})
        }
    }, [brackets.length])

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
                <button onClick={confirmBracket}>SHOW BRACKETS</button>
            </div>
        </li>
    )
}