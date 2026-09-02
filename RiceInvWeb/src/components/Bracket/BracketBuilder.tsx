import React, { useEffect, useRef, useState } from "react"
import BracketSet from "./BracketSet"
import useAuth from "../../hooks/useAuth"
import type { BracketNode } from "./Auxillery/tree"
import type { Placeholder, Profile, Team, TournamentParticipant, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types"
import { useXarrow, Xarrow, Xwrapper } from "../../util/xarrow-compat"
import { ObjectId } from "bson"

interface BracketBuilderProps {
    nodeArr : BracketNode[][];
    refMap : (idx : number) => React.RefObject<HTMLDivElement>;
    sets : TournamentSet[];
    setSets : React.Dispatch<React.SetStateAction<TournamentSet[]>>;
    stage : TournamentStage;
    subStage : TournamentSubStage;
    players : TournamentParticipant[];
}

export default function BracketBuilder({ nodeArr, refMap, sets, setSets, stage, subStage, players } : BracketBuilderProps) {

    const { auth } = useAuth();

    useEffect(() => {
        const sortedSeeds = players.filter(x => x.def === 'Placeholder').map((p) => {
                return { ...p, name : 'placeholder'}
            })
        sortedSeeds.sort((a, b) => a.points - b.points) // Should be ascending order of seeds

        let realCount = 0;
        let capacity = 0;

        const newSets : TournamentSet[] = [];

        nodeArr.reverse().map((level, i) => {
            level.map((node, j) => {
                const bracketWidth = level.length
                const setPlayers : TournamentParticipant[] = Array.from({ length: 2 }, () => null);

                if (realCount === 0) { // Start of bracket
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
                else {
                    const leftPrev = node.left?.value;
                    const rightPrev = node.right?.value
                    setPlayers[0] = {
                        def : 'Placeholder',
                        name : `${leftPrev} W`,
                        points : 0
                    }
                    setPlayers[1] = {
                        def : 'Placeholder',
                        name : `${rightPrev} W`,
                        points : 0
                    }
                }

                if (stage.format.includes('Single')) {}

                if (!node) {}

                const newSet : TournamentSet = {
                    id : new ObjectId().toHexString(),
                    order : node.value,
                    subStageId : subStage.id,
                    bestOf : 5,
                    participants : setPlayers.filter((x): x is Placeholder => x != null && x.def === 'Placeholder'),
                    participantType : 'Placeholder'
                }
                newSets.push(newSet);
            })

            if (level.length > 0) realCount += 1;
        })

        setSets(prev => [...prev, ...newSets]);

    }, [players.length, nodeArr.length]);

    return (
        <Xwrapper>
        {nodeArr.map((level, i) => {
            return (
                <div key={i}>
                    { level.length ? level.map((node, j) => {
                        return (
                            <React.Fragment key={j}>
                                <BracketSet bracketSet={sets.find(x => x.order === node.value)} ref={refMap(node.value)}/>
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

