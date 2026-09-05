import { useEffect, useRef, useState, type RefObject } from "react";
import type { TournamentData, WizardAction } from "../createTournamentPage";
import type { Profile, Team, TournamentParticipant, TournamentStage, TournamentSubStage } from "../../../data/types";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";
import GroupTable from "./GroupTable";
import { ObjectId } from "bson";


interface SetGroupsProps {
    itemRef : RefObject<HTMLLIElement>;
    dispatcher : React.ActionDispatch<[action: WizardAction]>;
    animInProgress : boolean;
    stageNum : number;
    participants : TournamentParticipant[];
    data : TournamentData;
}


export default function SetGroups({ itemRef, dispatcher, animInProgress, stageNum, participants, data } : SetGroupsProps) {
    
    const [groupSize, setGroupSize] = useState(4);
    const [groupMembers, setGroupMembers] = useState<TournamentParticipant[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [groups, setGroups] = useState<TournamentSubStage[]>([]);

    const [stage, setStage] = useState<TournamentStage>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const undo = () => {
        console.log(groups);
        console.log(stageNum);
        dispatcher({
            type : 'UNDO_STEP', 
            data : { }, 
            activeSSCount : groups.length, 
            isStage : true
        })
    }

    const sideUndo = () => {
        
    }

    const submitGroups = () => {
        const nextStage = data.stages.find(x => x.order === stageNum + 1)
        if (nextStage) {
            dispatcher({
                type : 'STEP', 
                data : {
                    step : `Set${nextStage.stageType}-${stageNum + 1}`, 
                },
                activeSSCount : groups.length,
                isStage : true
            });
        }
    }

    useEffect(() => {
        if (data.stages) {
            setStage(data.stages.find(x => x.order === stageNum))
        }
    }, [data]);

    const isParticipantAvailable = (participant : TournamentParticipant) => {
        const assignedMembers : string[] = groups.flatMap(x => x.members.flatMap(y => y.name));
        return !assignedMembers.includes(participant.name)
    }

    const getParticipants = () => {
        return participants.filter(x => isParticipantAvailable(x));
    }

    const confirmGroup = () => {
        setGroups([...groups, {
            id : new ObjectId().toHexString(),
            order : groups.length,
            stage : stageNum,
            name : groupName,
            format : stage?.format,
            subType : 'Sets',
            members : groupMembers,
        }]);
        setGroupMembers([]);
        setGroupName('');
    }

    useEffect(() => {
        if (groups.length > (data.subStages ? data.subStages.filter(x => x.stage === stageNum).length : 0)) {
            const num = getParticipants().length;
            setGroupSize(num < groupSize ? num : groupSize)
            inputRef.current.value = String(num);
            dispatcher({type : 'SIDESTEP', data : { subStages : groups }, ss: `SubGroupsSets-${stageNum}-${groups.length - 1}`})
        }
    }, [groups.length])

    useEffect(() => {
        if (data?.subStages && data.subStages.length !== groups.length) {
            setGroups(data.subStages.filter(x => x.stage === stageNum));
        }
    }, [data?.subStages?.length])

    return (
    <li className={'tournament-configuration-box'} ref={itemRef}>
        <div>
            <button onClick={undo}>Back</button>
            <button onClick={sideUndo}>Undo</button>
        </div>
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
                    <SelectableItemsList<TournamentParticipant> 
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