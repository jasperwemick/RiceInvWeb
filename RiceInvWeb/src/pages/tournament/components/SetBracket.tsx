import { useEffect, useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { TournamentParticipant, TournamentStage, TournamentSubStage } from "../../../data/types";
import { ObjectId } from "bson";

interface SetPlayoffsProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    stage : TournamentStage;
    data : TournamentData;
    participants : TournamentParticipant[];
}

export default function SetBracket({itemRef, dispatcher, stage, data, participants} : SetPlayoffsProps) {
    
    const [numPlayers] = useState(participants.length);
    // const [stage, setStage] = useState<TournamentStage | null>(null);
    const [brackets, setBrackets] = useState<TournamentSubStage[]>([]);

    const undo = () => {
        const prevStage = data.stages.find(x => x.order === stage.order + 1);
        dispatcher({
            type : 'UNDO_STEP',
            data : {},
            activeSSCount : brackets.length, 
            isStage : prevStage
        })
    }

    const submitBrackets = () => {
        const nextStage = data.stages.find(x => x.order === stage.order + 1);
        dispatcher({
            type : 'STEP', 
            data : {
                step : nextStage ? `Set${nextStage.stageType}-${stage.order + 1}` : `Review`, 
            },
            activeSSCount : brackets.length,
            isStage : nextStage
        });
 
    }

    const confirmBracket = () => {
        if (!stage) return;
        
        setBrackets([...brackets, {
            _id : new ObjectId().toHexString(),
            order : brackets.length,
            stage : stage._id,
            name : '',
            format : stage.format,
            subType : 'Sets',
            members : participants,
        }]);
    }

    useEffect(() => {
        if (brackets.length > (data.subStages.filter(x => x.stage === stage._id).length)) {
            dispatcher({type : 'SIDESTEP', data : { subStages : brackets }, ss: `SubBracketSets-${stage.order}-${brackets.length - 1}`})
        }
    }, [brackets.length])

    // useEffect(() => {
    //     if (data.stages) {
    //         setStage(data.stages.find(x => x.order === stageNum) ?? null)
    //     }
    // }, [data]);

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
                <button onClick={submitBrackets}>Finish</button>
            </div>
        </li>
    )
}