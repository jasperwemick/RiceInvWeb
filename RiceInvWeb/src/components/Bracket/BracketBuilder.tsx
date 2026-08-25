import React, { useEffect, useRef, useState } from "react"
import BracketSet from "./BracketSet"
import useAuth from "../../hooks/useAuth"
import type { BracketNode } from "./Auxillery/tree"
import type { TournamentSet } from "../../data/types"
import useGetRef from "../../hooks/useGetRef";
import { useXarrow, Xarrow, Xwrapper } from "../../util/xarrow-compat"

interface BracketBuilderProps {
    nodeArr : BracketNode[][];
    refMap : (idx : number) => React.RefObject<HTMLDivElement>;
    sets : TournamentSet[];
}

export default function BracketBuilder({ nodeArr, refMap, sets } : BracketBuilderProps) {

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

    // const [go, setGo] = useState<boolean>(false);
    // useEffect(() => {
    //     setGo(true);
    // }, [])

    const { auth } = useAuth();

    return (
        <Xwrapper>
        {nodeArr.map((level, i) => {
            return (
                <div key={i}>
                    { level.length ? level.map((node, j) => {
                        return (
                            <React.Fragment key={j}>
                                <BracketSet setData={sets.find(({ setId }) => setId === node.value)} ref={refMap(node.value)}/>
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

