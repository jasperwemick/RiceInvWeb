import { useEffect, useState } from "react"
import { type BracketNode, treeToArray } from "./Auxillery/tree"
import React from "react"
import BracketBuilder from "./BracketBuilder"
import apiFetch from "../../util/fetch"
import type { Placeholder, Profile, Team, TournamentSet, TournamentStage } from "../../data/types"
import useGetRef from "../../hooks/useGetRef"

interface BracketMapProps {
    stage : TournamentStage;
    highTree : BracketNode | null;
    lowTree : BracketNode | null;
    maxDepth : number;
    sets : TournamentSet[];
    setSets : React.Dispatch<React.SetStateAction<TournamentSet[]>>
    players : Profile[] | Team[] | Placeholder[];
}

export default function BracketMap({ stage, highTree, lowTree, maxDepth, sets, setSets, players } : BracketMapProps) {

    const [upperPlayers, setUpperPlayers] = useState<Profile[] | Team[] | Placeholder[]>([]);
    const [lowerPlayers, setLowerPlayers] = useState<Profile[] | Team[] | Placeholder[]>([]);

    const upperBracketArray = highTree ? treeToArray(highTree, maxDepth) : []
    const lowerBracketArray = lowTree ? treeToArray(lowTree, maxDepth) : []

    const getRef = useGetRef<HTMLDivElement>();
    const ps = players.filter(x => x.def === 'Placeholder');
    ps.sort((a, b) => b.points - a.points);

    useEffect(() => {
        console.log(upperPlayers)
    }, [upperPlayers])

    return (
        <React.Fragment>
            <div><BracketBuilder nodeArr={treeToArray(highTree, maxDepth)} refMap={getRef} sets={sets} setSets={setSets} stage={stage} players={
                // stage.format.includes('Biased') ? ps.filter((_, i) => i < Math.ceil(ps.length / 2)) : players
                players
            }/></div>
            <div><BracketBuilder nodeArr={treeToArray(lowTree, maxDepth)} refMap={getRef} sets={sets} setSets={setSets} stage={stage} players={
                // stage.format.includes('Biased') ? ps.filter((_, i) => i >= Math.ceil(ps.length / 2)) : []
                players
            }/></div>
        </React.Fragment>
    )
}