import { useEffect, useReducer, useRef, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import type { Profile, Team, TournamentStage, TournamentSubStage } from "../../../data/types";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import GroupTable from "./GroupTable";


interface SetGroupsProps {
    itemRef : RefObject<HTMLLIElement>;
    transition : (data : TournamentData, ss ? : { undo : boolean }) => void;
    animInProgress : boolean;
    stageNum : number;
    participants : Profile[] | Team[];
    data : TournamentData;
}

export type GroupActions = { type : 'add'; payload : TournamentSubStage } | { type : 'remove'; payload : TournamentSubStage }


export default function SetGroups({ itemRef, transition, animInProgress, stageNum, participants, data } : SetGroupsProps) {
    
    const [groupSize, setGroupSize] = useState(4);
    const [groupMembers, setGroupMembers] = useState<Profile[] | Team[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [groups, setGroups] = useState<TournamentSubStage[]>([]);

    const [stage, setStage] = useState<TournamentStage>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // function reducer(state : StageGroup[], action : GroupActions) {
    //     switch (action.type) {
    //         case 'add':
    //             return [...state, action.payload];
    //         case 'remove':
    //             return state.filter(x => x !== action.payload);
    //         default : {
    //             return state;
    //         }
    //     }
    // }

    // const [state, dispatch] = useReducer(reducer, [])

    useEffect(() => {
        if (data.stages) {
            console.log(data.stages, ' num ', stageNum);
            console.log('stage ', data.stages.find(x => x.order === stageNum))
            setStage(data.stages.find(x => x.order === stageNum))
        }
    }, [data]);

    const isParticipantAvailable = (participant : Profile | Team) => {
        const assignedMembers : string[] = groups.flatMap(x => x.members.flatMap(y => y.name));
        return !assignedMembers.includes(participant.name)
    }

    const getParticipants = () => {
        return participants.filter(x => isParticipantAvailable(x));
    }

    const confirmGroup = () => {
        setGroups([...groups, {
            stage : stage?.order,
            name : groupName,
            format : stage?.format,
            members : groupMembers,
        }]);
        setGroupMembers([]);
        setGroupName('');
    }

    const submitGroups = () => {
        const nextStage = data.stages.find(x => x.order === stageNum + 1)
        if (nextStage) {
            transition({nextStep : `Set${nextStage.stageType}`, isStage : true})
        }
    }

    useEffect(() => {
        if (groups.length > (data.subStages ? data.subStages.length : 0)) {
            const num = getParticipants().length;
            setGroupSize(num < groupSize ? num : groupSize)
            inputRef.current.value = String(num);
            console.log("lololol");
            transition({ nextStep : 'AddTournamentSets',  subStages : groups }, { undo : false })
        }
    }, [groups.length])

    useEffect(() => {
        if (data?.subStages && data.subStages.length !== groups.length) {
            setGroups(data.subStages)
        }
    }, [data?.subStages?.length])

    return (
    <li className={'tournament-configuration-box'} ref={itemRef}>
        <div className={'tournament-configuration-box-header'} >
            <p>Set Group Size</p>
        </div>
        <div className={'tournament-configuration-box-body'}>
            <input 
            ref={inputRef}
            value={groupSize} 
            type={'number'} 
            min={2} 
            max={getParticipants().length} 
            onChange={(e) => setGroupSize(Number(e.target.value))}/>
            <div className={'tournament-configuration-subbox'}>
                <p>{`Select Group Members`}</p>
                <div className={'tournament-participants-grid'}>
                    {!animInProgress && 
                    <SelectableItemsList<Profile | Team> 
                    list={getParticipants()} 
                    selection={{ selected : groupMembers, setSelected : setGroupMembers, multiple : true }} 
                    limit={groupSize}
                    removalPredicate={(a, b) => a.name != b.name} 
                    getLabel={(x) => x.name}/>}
                </div>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
            </div>
            <div className={'tournament-configuration-subbox'}>
                {!animInProgress && groupMembers.length === groupSize && groupSize !== 0 && <GroupTable groupSize={groupSize} members={groupMembers}/>}
                {
                getParticipants().length > 0 ? 
                <button onClick={confirmGroup}>Confirm</button> : 
                <button onClick={submitGroups}>Finish</button>
                }
            </div>
        </div>
    </li>
    )
}