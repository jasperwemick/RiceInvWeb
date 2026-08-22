import React from "react"
import BracketSet from "./BracketSet"
import * as XarrowModule from "react-xarrows";
const Xarrow = (XarrowModule as any).default.default;
import useAuth from "../../hooks/useAuth"
import type { BracketNode } from "./Auxillery/tree"
import type { TournamentSet } from "../../data/types"

interface BracketBuilderProps {
    nodeArr : BracketNode[][];
    tag : string;
    sets : TournamentSet[];
}

export default function BracketBuilder({ nodeArr, tag, sets } : BracketBuilderProps) {

    // const handleSlotClick = (node : BracketNode, tag : string) => {
    
    //     setToggleEditor(!toggleEditor)

    //     const retrieveSetData = () => {

    //         try {
    //             const jsponse = sets.find(({ setID }) => setID === node.value)

    //             if (jsponse) {
    //                 setEditorData({
    //                     ...editorData,
    //                     setID: node.value,
    //                     gameTag: tag,
    //                     upperSeedIDs: jsponse.upperSeedIDs,
    //                     upperSeedProfiles: jsponse.upperSeedProfiles,
    //                     upperSeedWins: jsponse.upperSeedWins,
    //                     lowerSeedIDs: jsponse.lowerSeedIDs,
    //                     lowerSeedProfiles: jsponse.lowerSeedProfiles,
    //                     lowerSeedWins: jsponse.lowerSeedWins,
    //                     bestOf: jsponse.bestOf,
    //                     parents: [
    //                         node.left ? `${tag}-bracket-set-${node.left.value}` : null, 
    //                         node.right ? `${tag}-bracket-set-${node.right.value}`: null
    //                     ],
    //                     lowerSetID: node.buddy ? node.buddy.value : -1,
    //                     nextSetID: node.parent ? node.parent.value : -1
    //                 })
    //             }
    //             else {
    //                 setEditorData({
    //                     ...editorData,
    //                     setID: node.value,
    //                     gameTag: tag,
    //                     parents: [
    //                         node.left ? `${tag}-bracket-set-${node.left.value}` : null, 
    //                         node.right ? `${tag}-bracket-set-${node.right.value}`: null
    //                     ],
    //                     lowerSetID: node.buddy ? node.buddy.value : -1,
    //                     nextSetID: node.parent ? node.parent.value : -1
    //                 })
    //             }
    //         }
    //         catch(e) {
    //             console.log('Failed to fetch data: ', e)
    //         }
    //     }

    //     retrieveSetData()
    // }

    const { auth } = useAuth();

    return nodeArr.map((level, i) => {
        return (
            <div key={i}>
                {level.map((node, j) => {   
                    return (
                        <React.Fragment key={j}>
                            <div className="bracket-set-shell" id={`${tag}-bracket-set-${node.value}`}>
                                <BracketSet setData={sets.find(({ setId }) => setId === node.value)}/>
                            </div>
                            {node.parent ? <Xarrow start={`${tag}-bracket-set-${node.value}`} end={`${tag}-bracket-set-${node.parent.value}`} headSize={0}/> : <></>}
                        </React.Fragment>
                    )
                })}
            </div>
        )
    })
}

