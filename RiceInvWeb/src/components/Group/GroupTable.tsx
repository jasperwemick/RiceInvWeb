import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type HtmlHTMLAttributes } from "react";
import type { Profile, Team, TournamentMatch, TournamentParticipant, TournamentSet } from "../../data/types";
import { ObjectId } from "bson";
import React from "react";
import './group.css'

interface GroupCellProps extends HTMLAttributes<HTMLDivElement>{
    text : string;
    index : number;
    sets : TournamentSet[];
    matches : TournamentMatch[];
    interactive : boolean;
    dialogRef : React.RefObject<HTMLDialogElement | null>;
    openModal : () => void;
    closeModal : () => void;
}


function GroupCell({text, index, sets, matches, interactive, dialogRef, openModal, closeModal, ...rest} : GroupCellProps) {

    useEffect(() => {

    }, [index, interactive])

    return (
        <React.Fragment>
            <div onClick={interactive ? openModal : undefined} {...rest}><p style={{ userSelect : 'none' }}>{text}</p></div>

            <dialog ref={dialogRef} className={`set-dialog`}>
                    <div>
                        <p>{`Test`}</p>
                        <button onClick={closeModal}>{`x`}</button>
                    </div>
            </dialog>
        </React.Fragment>
    )
}

interface GroupTableProps {
    groupSize : number;
    members : TournamentParticipant[];
    subId ? : string;
    sets ? : TournamentSet[];
    matches ? : TournamentMatch[];
    setSets ? : React.Dispatch<React.SetStateAction<TournamentSet[]>>;
    interactive ? : boolean;
}

export default function GroupTable({ groupSize, members, subId, sets = [], matches = [], setSets, interactive } : GroupTableProps) {

    const [groupCells, setGroupCells] = useState<string[]>([]);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        dialogRef.current?.showModal();
    }
    const closeModal = () => {
        dialogRef.current?.close();
    }

    interface CastResult {
        data : Profile[] | Team[],
        dataType : 'Profile' | 'Team'
    }

    const castMixedMembers = (list : TournamentParticipant[]) : CastResult => {
        if (list.every(x => x.def === 'Profile')) return {data : list, dataType : 'Profile'};
        if (list.every(x => x.def === 'Team')) return {data : list, dataType : 'Team'};
        return { data : [], dataType : 'Profile' };
    }

    useEffect(() => {

    }, [sets])

    useEffect(() => {
        const matrixSize = groupSize + 1;
        const arr = Array.from({length : Math.pow(matrixSize, 2)}, () => '');
        let setList : TournamentSet[] = [];
        let order : number = 0;
        
        setGroupCells(arr.map((_, index) => {
            if (index === 0) return '';
            if (index < matrixSize || index % matrixSize === 0) { // Name
                console.log(members);
                return members[index % groupSize].name;
            }

            if (interactive && index !== Math.floor(index / matrixSize) * (matrixSize + 1)) { // Set
                const row = Math.floor(index / matrixSize);
                const col = index % matrixSize;

                if (row > col && sets) order += 1;

                if (row > col && sets && sets.length === 0 && subId) {
                    const setMembers = castMixedMembers([members[row % groupSize], members[col % groupSize]]);
                    setList.push({
                        _id : new ObjectId().toHexString(),
                        subStage : subId,
                        order : setList.length,
                        bestOf : 5,
                        participants : setMembers.data,
                        participantType : setMembers.dataType,
                    });
                }
                if (sets && sets.length > 0) {
                    
                    const winners = matches.filter(x => x.setId === sets.find(x => x.order === order)?._id).flatMap(x => x.winner);

                    if (winners.length === 0) return `p1 (0) - p2 (0)`;

                    const uniqueNames = [...new Set(winners.flatMap(x => x.name))];
                    type NameType = typeof uniqueNames[number];
                    const setScore = winners.reduce((accum : Record<NameType, number>, curr) => {
                        accum[curr.name] += 1
                        return accum;
                    }, Object.fromEntries(uniqueNames.map(key => [key, 0])));
                    // console.log('winners, ', winners);
                    // console.log('names, ', uniqueNames);
                    const text = uniqueNames.map((player) => {
                        return `${player} (${setScore[player]})`
                    }).join(' - ');
                    // console.log('set, ', text);
                    return text
                }
                else return `p1 (0) - p2 (0)`;
            }
            return '';
        }));
        if (interactive && setList.length && setSets) {
            setSets(setList);
        }
    }, [groupSize])

    const mapCrossTable = () => {
        const matrixSize = groupSize + 1
        const borderDef = `0.25rem solid #10263bff`
        return groupCells.map((cell, index) => {
            const bottom = index >= (Math.pow(matrixSize, 2) - matrixSize);
            const right = index % matrixSize === matrixSize - 1;
            const greyArea = index === Math.floor(index / matrixSize) * (matrixSize + 1);
            return (
                <GroupCell style={{
                    borderTop: borderDef,
                    borderLeft: borderDef,
                    borderBottom : bottom ? borderDef : undefined,
                    borderRight : right ? borderDef : undefined,
                    backgroundColor : greyArea ? '#616161ff' : '#68849eff'
                }} 
                className={`group-cell`}
                text={cell} 
                index={index} 
                sets={sets}
                matches={matches}
                interactive={interactive ?? false} 
                dialogRef={dialogRef}
                openModal={openModal}
                closeModal={closeModal}/>
            )
        })
    }

    return (
        <div style={{ 
            display : 'grid', 
            gridTemplateColumns : `repeat(${groupSize + 1}, 1fr)`,
            borderRadius : 0,
            padding : `1rem`,
            margin : `1rem`,
        }}>{mapCrossTable()}</div>
    )
}