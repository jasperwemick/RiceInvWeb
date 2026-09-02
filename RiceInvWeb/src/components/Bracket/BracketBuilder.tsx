import React, { useEffect, useRef, useState } from "react"
import BracketSet from "./BracketSet"
import useAuth from "../../hooks/useAuth"
import type { BracketNode } from "./Auxillery/tree"
import type { Placeholder, Profile, Team, TournamentSet, TournamentStage } from "../../data/types"
import useGetRef from "../../hooks/useGetRef";
import { useXarrow, Xarrow, Xwrapper } from "../../util/xarrow-compat"

interface BracketBuilderProps {
    nodeArr : BracketNode[][];
    refMap : (idx : number) => React.RefObject<HTMLDivElement>;
    sets : TournamentSet[];
    setSets : React.Dispatch<React.SetStateAction<TournamentSet[]>>;
    stage : TournamentStage;
    players : Profile[] | Team[] | Placeholder[];
}

export default function BracketBuilder({ nodeArr, refMap, sets, setSets, stage, players } : BracketBuilderProps) {

    const { auth } = useAuth();

    useEffect(() => {
        const sortedSeeds = players.filter(x => x.def === 'Placeholder').map((p) => {
                return { ...p, name : 'placeholder'}
            })
        sortedSeeds.sort((a, b) => a.points - b.points) // Should be ascending order of seeds

        let realCount = 0;
        let capacity = 0;
        console.log(sortedSeeds, " SORTED SEEDS");
        console.log(nodeArr, ' node arr');
        console.log()

        const newSets : TournamentSet[] = [];

        nodeArr.reverse().map((level, i) => {
            level.map((node, j) => {
                const bracketWidth = level.length
                const setPlayers : (Profile | Team | Placeholder)[] = Array.from({ length: 2 }, () => null);

                if (realCount === 0) { // Start of bracket
                    console.log('what do mean');
                    if (sortedSeeds.length > bracketWidth * 2) {
                        setPlayers[0] = sortedSeeds[bracketWidth + j];
                        setPlayers[1] = sortedSeeds[bracketWidth - 1 - j];
                    }
                    else {
                        setPlayers[0] = sortedSeeds[j];
                        setPlayers[1] = sortedSeeds[bracketWidth * 2 - 1 - j];
                    }
                    capacity += 2
                }
                else if (sortedSeeds.length > capacity) { // Fill top spot of sets following the first column until all are accounted for
                    setPlayers[0] = sortedSeeds[capacity + j]

                    const lowerPrev = node.right ? node.right.value : node.left ? node.left.value : 'What'
                    setPlayers[1] = {
                        def : 'Placeholder',
                        name : `${lowerPrev} W`,
                        points : 0
                    }
                    capacity += 1
                }

                if (stage.format.includes('Single')) {}

                if (!node) {}

                const newSet : TournamentSet = {
                    setId : node.value,
                    stage : stage,
                    stageOrder : stage.order,
                    subStageOrder : 0,
                    bestOf : 5,
                    participants : setPlayers.filter((x): x is Placeholder => x != null && x.def === 'Placeholder'),
                    participantType : 'Placeholder'
                }
                realCount += 1;
                newSets.push(newSet);
            })
        })

        setSets(prev => [...prev, ...newSets]);

    }, [players.length, nodeArr.length]);

    useEffect(() => {
        console.log("Let's see those sets!");
        console.log(sets)
    }, [sets.length])

    return (
        <Xwrapper>
        {nodeArr.map((level, i) => {
            return (
                <div key={i}>
                    { level.length ? level.map((node, j) => {
                        return (
                            <React.Fragment key={j}>
                                <BracketSet bracketSet={sets.find(x => x.setId === node.value)} ref={refMap(node.value)}/>
                                {
                                node.parent ?
                                <Xarrow 
                                start={refMap(node.value)} 
                                end={refMap(node.parent.value)}
                                headSize={0}
                                startAnchor={'right'}
                                endAnchor={'left'}/> : 
                                null
                                }
                            </React.Fragment>
                        )

                    }) : <div className={`bracket-ghost-shell`}/>}
                </div>
            )
        })}
        </Xwrapper>
    )
}

