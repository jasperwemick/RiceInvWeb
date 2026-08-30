import { useEffect, useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { Profile, Team, TournamentStage } from "../../../data/types";
import { GenerateBracket } from "../../../components/Bracket/GenerateBracket";

interface SetPlayoffsProps {
    itemRef : RefObject<HTMLLIElement>
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    stageNum : number;
    data : TournamentData;
    participants : Profile[] | Team[]
}

export default function SetPlayoffs({itemRef, dispatcher, animInProgress, stageNum, data, participants} : SetPlayoffsProps) {
    
    const [numPlayers, setNumPlayers] = useState(participants.length);
    const [stage, setStage] = useState<TournamentStage>(null);

    const undo = () => {
        dispatcher({
            type : 'UNDO_STEP',
            data : {},
            isStage : true
        })
    }

    const submit = () => {

    }

    useEffect(() => {
        if (data.stages) {
            setStage(data.stages.find(x => x.order === stageNum))
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
                type={stage.format} 
                players={participants} 
                gameTag={'placeholder'}
                sets={data.sets}/> : 
                <></>}
            </div>
        </li>
    )
}