import React from "react"
import BracketSet from "./BracketSet"
import Xarrow from "react-xarrows"
import useAuth from "../../hooks/useAuth"
import { BracketNode } from "./Auxillery/tree"
import { TournamentSet } from "../../data/types"

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

    return nodeArr.map((level, index) => {
        return (
            <div key={index}>
                {level.map((node, index) => {   
                    return (
                        <React.Fragment key={index}>
                            <div className="bracket-set-shell" id={`${tag}-bracket-set-${node.value}`} onClick={() => {
                                // if (auth?.username) {
                                //     if (auth.roles.includes('Admin')) {
                                //         handleSlotClick(node, tag)
                                //     }
                                // }
                            }}>
                                <BracketSet setData={sets.find(({ setId }) => setId === node.value)}/>
                            </div>
                            {node.parent ? <Xarrow start={`${tag}-bracket-set-${node.value}`} end={`${tag}-bracket-set-${node.parent.value}`} headSize={0}/> : null}
                        </React.Fragment>
                    )
                })}
            </div>
        )
    })
}

