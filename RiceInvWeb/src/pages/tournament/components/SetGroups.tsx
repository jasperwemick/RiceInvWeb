import { useEffect, useState, type RefObject } from "react";
import type { TournamentData } from "../createTournamentPage";
import type { Profile, Team } from "../../../data/types";
import SelectableItemsList from "../../../components/SelectableList/selectableItemsList";


function GroupTable({ groupSize, members } : { groupSize : number, members : Profile[] | Team[] }) {

    const [groupCells, setGroupCells] = useState<string[]>([])

    useEffect(() => {
        const arr = Array.from({length : Math.pow(groupSize, 2)}, () => '')
        for (let i = 0; i < arr.length; i++) {
            arr[i]
        }
        setGroupCells(arr.map((_, index) => {
            if (index === 0) return '\\';
            if (index < groupSize || index % groupSize === 0) {
                return members[index % groupSize].name;
            }
            return '';
        }))
    }, [groupSize])

    const mapRoundRobinGrid = () => {
        return groupCells.map((cell, index) => {
            return (
                <div>{cell}</div>
            )
        })
    }

    return (
        <div style={{ display : 'grid', gridTemplateColumns : `repeat(${groupSize}, 1fr)` }}>{mapRoundRobinGrid()}</div>
    )
}

interface SetGroupsProps {
    itemRef : RefObject<HTMLLIElement>;
    transition : (data : TournamentData, ss : boolean) => void;
    animInProgress : boolean;
    groupFormat : 'Round Robin' | 'Swiss' | 'Random';
    participants : Profile[] | Team[];
}

export default function SetGroups({ itemRef, transition, animInProgress, groupFormat, participants } : SetGroupsProps) {
    
    const [groupSize, setGroupSize] = useState(4)
    const [groupMembers, setGroupMembers] = useState<Profile[] | Team[]>([])

    return (
    <li className={'tournament-configuration-box'} ref={itemRef}>
        <div className={'tournament-configuration-box-header'} >
            <p>Set Group Size</p>
        </div>
        <div className={'tournament-configuration-box-body'}>
            <input type={'number'} min={2} max={8} onChange={(e) => setGroupSize(Number(e.target.value))}/>
            <div className={'tournament-configuration-subbox'}>
                <p>{`Select Group Members`}</p>
                <div className={'tournament-participants-grid'}>
                    {!animInProgress && 
                    <SelectableItemsList<Profile | Team> 
                    list={participants} 
                    selection={{ selected : groupMembers, setSelected : setGroupMembers, multiple : true }} 
                    limit={groupSize}
                    removalPredicate={(a, b) => a.name != b.name} 
                    getLabel={(x) => x.name}/>}
                </div>
            </div>
            <div className={'tournament-configuration-subbox'}>
                {groupMembers.length === groupSize && <GroupTable groupSize={groupSize} members={groupMembers}/>}
            </div>
        </div>
    </li>
    )
}