import React, { useEffect, useState } from "react"

import './style/Bracket.css'
import { BracketNode, GenerateBracketTree, getMaxDepth, treeToArray } from './Auxillery/tree'
import useAuth from '../../hooks/useAuth'
import BracketMap from "./BracketMap"

interface GenerateBracketProps {
    type : string;
    numPlayers : number;
    format : string;
    gameTag : string;
}

export const GenerateBracket = ({type, numPlayers, format, gameTag} : GenerateBracketProps) => {

    const [highTree, setHighTree] = useState<BracketNode | null>(null);
    const [lowTree, setLowTree] = useState<BracketNode | null>(null);
    const [maxDepth, setMaxDepth] = useState(0);
    const [allNodes, setAllNodes] = useState<BracketNode[]>([])

    const { auth }  = useAuth()

    let bracketTree = GenerateBracketTree(type, numPlayers, format)
    const depth = getMaxDepth(bracketTree.parent ? bracketTree.parent : bracketTree)
    const treeArr = treeToArray(bracketTree.parent ? bracketTree.parent : bracketTree, depth).flat()

    let lowerBracketTree : BracketNode | null = null
    let upperBracketTree : BracketNode | null = null

    if (type === 'Single') {
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
    
    useEffect(() => {

        setMaxDepth(depth)
        setAllNodes(treeArr)

        setHighTree(upperBracketTree)
        setLowTree(lowerBracketTree)

    }, [type, numPlayers, format])
    
    return (
        <div /*onLoadStart={useXarrow()}*/ className="bracket-container">
            <BracketMap tag={gameTag} tid={""} highTree={upperBracketTree} lowTree={lowerBracketTree} maxDepth={depth}/>
        </div>
    )
}