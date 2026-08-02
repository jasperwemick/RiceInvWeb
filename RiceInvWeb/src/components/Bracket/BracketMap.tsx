import { useEffect, useState } from "react"
import { type BracketNode, treeToArray } from "./Auxillery/tree"
import GetUrl from "../../util/GetUrl"
import React from "react"
import BracketBuilder from "./BracketBuilder"
import apiFetch from "../../util/fetch"
import type { TournamentSet } from "../../data/types"

interface BracketMapProps {
    tid : string;
    tag : string;
    highTree : BracketNode | null;
    lowTree : BracketNode | null;
    maxDepth : number;
}

export default function BracketMap({ tid, tag, highTree, lowTree, maxDepth } : BracketMapProps) {

    const [toggleEditor , setToggleEditor] = useState(false)

    const [editorData, setEditorData] = useState<TournamentSet | null>(null)

    const [sets, setSets] = useState<TournamentSet[]>([])

    const upperBracketArray = highTree ? treeToArray(highTree, maxDepth) : []
    const lowerBracketArray = lowTree ? treeToArray(lowTree, maxDepth) : []

    useEffect(() => {

        const getSetData = async () => {

            try {
                const jsetData = await apiFetch<TournamentSet[]>(`${GetUrl}/api/tournament/${tid}/set`);
                setSets(jsetData)
            }
            catch(e) {
                console.log('Failed to fetch: ', e)
            }

        }

        getSetData()
    }, [!toggleEditor])

    return (
        <React.Fragment>
            {/* <BracketSetEditor 
                editorData={editorData} 
                setEditorData={setEditorData} 
                toggleEditor={toggleEditor}
                setToggleEditor={setToggleEditor}
                allSets={allNodes}/> */}
            <div><BracketBuilder nodeArr={upperBracketArray} tag={tag} sets={sets}/></div>
            <div><BracketBuilder nodeArr={lowerBracketArray} tag={tag} sets={sets}/></div>
        </React.Fragment>
    )
}