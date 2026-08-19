import { useEffect, useState, type CSSProperties } from "react"
import type { Profile, Team } from "../../../data/types"



function GroupCell({style, text, index, interactive} : {style : CSSProperties | undefined, text : string, index : number, interactive : boolean}) {

    useEffect(() => {



    }, [index, interactive])

    const openSetView = () => {
        
    }

    return (
        <div onClick={interactive && openSetView} style={style}>{text}</div>
    )
}

interface GroupTableProps {
    groupSize : number;
    members : Profile[] | Team[];
    interactive ? : boolean;
}

export default function GroupTable({ groupSize, members, interactive } : GroupTableProps) {

    const [groupCells, setGroupCells] = useState<string[]>([])

    useEffect(() => {
        const matrixSize = groupSize + 1
        const arr = Array.from({length : Math.pow(matrixSize, 2)}, () => '')
        setGroupCells(arr.map((_, index) => {
            if (index === 0) return '';
            if (index < matrixSize || index % matrixSize === 0) {
                return members[index % groupSize].name;
            }
            return '';
        }))
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