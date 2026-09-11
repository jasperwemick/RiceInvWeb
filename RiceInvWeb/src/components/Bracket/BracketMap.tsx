import { type BracketNode, treeToArray } from "./Auxillery/tree"
import React, { useEffect, useState } from "react"
import BracketBuilder from "./BracketBuilder"
import type { TournamentParticipant, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types"
import useGetRef from "../../hooks/useGetRef"

interface BracketMapProps {
    stage : TournamentStage;
    subStage : TournamentSubStage;
    highTree : BracketNode | null;
    lowTree : BracketNode | null;
    maxDepth : number;
    sets : TournamentSet[];
    setSets : React.Dispatch<React.SetStateAction<TournamentSet[]>>
    players : TournamentParticipant[];
}

export default function BracketMap({ stage, subStage, highTree, lowTree, maxDepth, sets, setSets, players } : BracketMapProps) {

    const [highNodes, setHighNodes] = useState<BracketNode[][]>([]);
    const [lowNodes, setLowNodes] = useState<BracketNode[][]>([]);

    useEffect(() => {
        const arr = treeToArray(
            highTree, 
            maxDepth, 
            subStage.format.includes('Bias') ? 'UDB' : subStage.format.includes('Double') ? 'UD' : 'U', 
            subStage.qualificationSlots
        )
        setHighNodes(arr)
    }, [highTree, subStage]);

    useEffect(() => {
        const arr = treeToArray(
            lowTree, 
            maxDepth, 
            subStage.format.includes('Bias') ? 'LDB' : 'LD', 
            subStage.qualificationSlots
        )
        setLowNodes(arr)
    }, [lowTree, subStage])

    const getRef = useGetRef<HTMLDivElement>();
    const ps = players.filter(x => x.def === 'Placeholder');
    ps.sort((a, b) => b.points - a.points);

    return (
        <React.Fragment>
            <div>
                <BracketBuilder nodeArr={highNodes} refMap={getRef} sets={sets} setSets={setSets} stage={stage} subStage={subStage} players={
                stage.format.includes('Biased') ? ps.filter((_, i) => i < Math.ceil(ps.length / 2)) : players
            } layer="Upper" buddyReference={lowNodes.flat()}/></div>
            <div><BracketBuilder nodeArr={lowNodes} refMap={getRef} sets={sets} setSets={setSets} stage={stage} subStage={subStage} players={
                stage.format.includes('Biased') ? ps.filter((_, i) => i >= Math.ceil(ps.length / 2)) : []
            } layer="Lower" buddyReference={highNodes.flat()}/></div>
        </React.Fragment>
    )
}