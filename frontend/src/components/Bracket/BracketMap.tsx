import { useEffect, useState } from "react"
import { treeToArray } from "./Auxillery/tree"
import GetUrl from "../../GetUrl"
import React from "react"
import Xarrow from "react-xarrows"
import BracketSet from "./BracketSet"
import BracketBuilder from "./BracketBuilder"
import apiFetch from "../../fetch"
import { TournamentSet } from "../../data/types"

interface BracketMapProps {
    tag : string
}

export default function BracketMap({ tag } : BracketMapProps) {

    const upperBracketArray = treeToArray(highTree, maxDepth)
    const lowerBracketArray = treeToArray(lowTree, maxDepth)

    const [toggleEditor , setToggleEditor] = useState(false)

    const [editorData, setEditorData] = useState<TournamentSet | null>(null)

    const [sets, setSets] = useState<TournamentSet[]>([])

    useEffect(() => {

        const getSetData = async () => {

            try {
                
                let jsetData = await apiFetch<TournamentSet[]>(`${GetUrl}/api/tournament/${tid}/set`);

                setSets(() => {
                    return jsetData.map((set) => {
                        return {
                            ...set,
                            upperSeedIDs: set.upperSeedProfiles.map(x => x._id),
                            lowerSeedIDs: set.lowerSeedProfiles.map(x => x._id)
                        }
                    })
                })
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