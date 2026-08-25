import { useEffect, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import type { Profile, Team, TournamentStage } from "../../../data/types";
import { GenerateBracket } from "../../../components/Bracket/GenerateBracket";

interface SetPlayoffsProps {
    itemRef : RefObject<HTMLLIElement>
    transition : (data : TournamentData, ss ? : { undo : boolean }) => void;
    animInProgress : boolean;
    stageNum : number;
    data : TournamentData;
    participants : Profile[] | Team[]
}

export default function SetPlayoffs({itemRef, transition, animInProgress, stageNum, data, participants} : SetPlayoffsProps) {
    
    const [numPlayers, setNumPlayers] = useState(16);
    const [stage, setStage] = useState<TournamentStage>(null);

    useEffect(() => {
        if (data.stages) {
            setStage(data.stages.find(x => x.order === stageNum))
        }
    }, [data]);
    
    return (
        <li className={'tournament-configuration-box'} ref={itemRef}>
            <div className={'tournament-configuration-box-header'} >
                <p>Set the Playoff Bracket</p>
            </div>
            <div className={'tournament-configuration-box-body'}>
                {stage ? <GenerateBracket type={stage.format} numPlayers={numPlayers} gameTag={'placeholder'}/> : <></>}
            </div>
        </li>
    )
}