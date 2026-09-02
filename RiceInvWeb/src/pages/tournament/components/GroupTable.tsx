import { useEffect, useState, type CSSProperties } from "react"
import type { Profile, Team, TournamentParticipant, TournamentSet } from "../../../data/types"
import { ObjectId } from "bson"


function GroupCell({style, text, index, interactive} : {style : CSSProperties | undefined, text : string, index : number, interactive : boolean}) {

    useEffect(() => {



    }, [index, interactive])

    const openSetView = () => {
        
    }

    return (
        <div onClick={interactive ? openSetView : undefined} style={style}>{text}</div>
    )
}

interface GroupTableProps {
    groupSize : number;
    members : TournamentParticipant[];
    subId ? : string;
    sets ? : TournamentSet[];
    setSets ? : React.Dispatch<React.SetStateAction<TournamentSet[]>>;
    interactive ? : boolean;
}

export default function GroupTable({ groupSize, members, subId, sets, setSets, interactive } : GroupTableProps) {

    const [groupCells, setGroupCells] = useState<string[]>([]);

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
        const matrixSize = groupSize + 1;
        const arr = Array.from({length : Math.pow(matrixSize, 2)}, () => '');
        let setList : TournamentSet[] = [];
        setGroupCells(arr.map((_, index) => {
            if (index === 0) return '';
            if (index < matrixSize || index % matrixSize === 0) { // Name
                return members[index % groupSize].name;
            }

            if (interactive && index !== Math.floor(index / matrixSize) * (matrixSize + 1)) { // set
                const row = Math.floor(index / matrixSize);
                const col = index % matrixSize;
                if (row > col && sets && sets.length === 0) {
                    const setMembers = castMixedMembers([members[row % groupSize], members[col % groupSize]]);
                    setList.push({
                        id : new ObjectId().toHexString(),
                        subStageId : subId,
                        order : setList.length,
                        bestOf : 5,
                        participants : setMembers.data,
                        participantType : setMembers.dataType,
                    });
                }

                return `${0} - ${0}`;
            }
            return '';
        }));
        if (interactive && setList.length) {
            console.log('adding new sets');
            console.log(setList);
            setSets(setList);
        }
    }, [groupSize])

    const mapCrossTable = () => {
        const matrixSize = groupSize + 1
        const borderDef = `0.25rem solid #10263bff`
        return groupCells.map((cell, index) => {
            const bottom = index >= (Math.pow(matrixSize, 2) - matrixSize)
            const right = index % matrixSize === matrixSize - 1;
            const greyArea = index === Math.floor(index / matrixSize) * (matrixSize + 1)
            return (
                <GroupCell style={{
                    borderTop: borderDef,
                    borderLeft: borderDef,
                    borderBottom : bottom ? borderDef : undefined,
                    borderRight : right ? borderDef : undefined,
                    borderRadius: 0,
                    minWidth : `max-content`,
                    minHeight : `2rem`,
                    fontSize : `clamp(0.5pc, 0.75pc, 1pc)`,
                    backgroundColor : greyArea ? '#616161ff' : '#68849eff',
                    textAlign : 'center',
                    alignContent : 'center'
                }} text={cell} index={index} interactive={interactive}/>
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