import { useEffect, useState } from "react"

import './style/Bracket.css'
import { type BracketNode, GenerateBracketTree, getMaxDepth, treeToArray } from './Auxillery/tree'
import useAuth from '../../hooks/useAuth'
import BracketMap from "./BracketMap"
import type { TournamentParticipant, TournamentSet, TournamentStage, TournamentSubStage } from "../../data/types"

interface GenerateBracketProps {
    stage : TournamentStage;
    subStage : TournamentSubStage;
    players : TournamentParticipant[];
    sets : TournamentSet[];
    setSets : React.Dispatch<React.SetStateAction<TournamentSet[]>>
}

export const GenerateBracket = ({stage, subStage, players, sets, setSets} : GenerateBracketProps) => {

    const [highTree, setHighTree] = useState<BracketNode | null>(null);
    const [lowTree, setLowTree] = useState<BracketNode | null>(null);
    const [maxDepth, setMaxDepth] = useState(0);
    const [allNodes, setAllNodes] = useState<BracketNode[]>([]);
    
    const { auth }  = useAuth();


    useEffect(() => {

        const bracketTree = GenerateBracketTree(stage.format, players.length)
        const depth = getMaxDepth(bracketTree.parent ? bracketTree.parent : bracketTree)
        const treeArr = treeToArray(bracketTree.parent ? bracketTree.parent : bracketTree, depth).flat()

        let lowerBracketTree : BracketNode | null = null
        let upperBracketTree : BracketNode | null = null

        if (stage.format.includes('Single')) {
            upperBracketTree = { ...bracketTree }
        }
        else {
            // Insane voodoo shit in order to preserve upper and lower bracket connectivity at grandfinals
            if (bracketTree.right) {
                lowerBracketTree = { ...bracketTree.right }
            }
            upperBracketTree = { ...bracketTree }
            upperBracketTree.right = null
            if (upperBracketTree.parent != null) {
                let gf = { ...upperBracketTree }
                upperBracketTree = upperBracketTree.parent
                upperBracketTree.right = gf
            }
        }

        setMaxDepth(depth);
        setAllNodes(treeArr);

        setHighTree(upperBracketTree);
        setLowTree(lowerBracketTree);

    }, [stage.format, players.length])
    
    return (
        <div className="bracket-container">
            <BracketMap 
            stage={stage}
            subStage={subStage}
            highTree={highTree} 
            lowTree={lowTree} 
            maxDepth={maxDepth}
            sets={sets}
            setSets={setSets}
            players={players}/>
        </div>
    )
}