import React, { useEffect, useState, useRef } from "react"
import Xarrow, { useXarrow } from 'react-xarrows'

import './style/Bracket.css'
import GetUrl from "../../GetUrl"
import { BracketSet } from "./BracketSet"
import { GenerateBracketTree, getMaxDepth, treeToArray } from './Auxillery/tree'
import { BracketSetEditor } from "./BracketSetEditor"
import useAuth from '../../hooks/userAuth'

export const GenerateBracket = ({type, numPlayers, format, gameTag}) => {

    const [highTree, setHighTree] = useState(null)
    const [lowTree, setLowTree] = useState(null)
    const [maxDepth, setMaxDepth] = useState(0)
    const [allNodes, setAllNodes] = useState([])

    const { auth, setAuth }  = useAuth()
    
    useEffect(() => {

        let bracketTree = GenerateBracketTree(type, numPlayers, format)
        const depth = getMaxDepth(bracketTree.parent ? bracketTree.parent : bracketTree)
        setMaxDepth(depth)

        const treeArr = treeToArray(bracketTree.parent ? bracketTree.parent : bracketTree, depth).flat()
        setAllNodes(treeArr)
        
        let lowerBracketTree = null
        let upperBracketTree = null

        if (type === 'Single') {
            upperBracketTree = { ...bracketTree }
        }
        else {
            // Insane voodoo shit in order to preserve upper and lower bracket connectivity at grandfinals
            lowerBracketTree = { ...bracketTree.right }
            upperBracketTree = { ...bracketTree }
            upperBracketTree.right = null
            if (upperBracketTree.parent != null) {
                let gf = { ...upperBracketTree }
                upperBracketTree = upperBracketTree.parent
                upperBracketTree.right = gf
            }
        }

        setHighTree(upperBracketTree)
        setLowTree(lowerBracketTree)

    }, [type, numPlayers, format])

    const BracketMap = ({tag}) => {

        const upperBracketArray = treeToArray(highTree, maxDepth)
        const lowerBracketArray = treeToArray(lowTree, maxDepth)

        const [toggleEditor , setToggleEditor] = useState(false)

        const [editorData, setEditorData] = useState({
            setID: 0,
            gameTag: "",
            upperSeedIDs: [],
            upperSeedProfiles: [],
            upperSeedWins: '',
            lowerSeedIDs: [],
            lowerSeedProfiles: [],
            lowerSeedWins: '',
            bestOf: '',
            parents: [],
            lowerSetID: -1,
            nextSetID: -1
        })

        const [sets, setSets] = useState([])

        useEffect(() => {

            const getSetData = async () => {

                try {
                    const setData = await fetch(`${GetUrl}/api/games/set/${tag}`)
                    let jsetData = await setData.json()

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

        const BuildBracket = ({nodeArr}) => {

            return nodeArr.map((level, index) => {
                return (
                    <div key={index}>
                        {level.map((node, index) => {   
                            return (
                                <React.Fragment key={index}>
                                    <div className="bracket-set-shell" id={`${tag}-bracket-set-${node.value}`} onClick={() => {
                                        if (auth.user) {
                                            if (auth.roles.includes('Admin')) {
                                                handleSlotClick(node, tag)
                                            }
                                        }
                                    }}>
                                        <BracketSet setData={sets.find(({ setID }) => setID === node.value)}/>
                                    </div>
                                    {node.parent ? <Xarrow start={`${tag}-bracket-set-${node.value}`} end={`${tag}-bracket-set-${node.parent.value}`} headSize={0}/> : null}
                                </React.Fragment>
                            )
                        })}
                    </div>
                )
            })
        }

        const handleSlotClick = (node, tag) => {
            
            setToggleEditor(!toggleEditor)

            const retrieveSetData = () => {

                try {
                    const jsponse = sets.find(({ setID }) => setID === node.value)

                    if (jsponse) {
                        setEditorData({
                            ...editorData,
                            setID: node.value,
                            gameTag: tag,
                            upperSeedIDs: jsponse.upperSeedIDs,
                            upperSeedProfiles: jsponse.upperSeedProfiles,
                            upperSeedWins: jsponse.upperSeedWins,
                            lowerSeedIDs: jsponse.lowerSeedIDs,
                            lowerSeedProfiles: jsponse.lowerSeedProfiles,
                            lowerSeedWins: jsponse.lowerSeedWins,
                            bestOf: jsponse.bestOf,
                            parents: [
                                node.left ? `${tag}-bracket-set-${node.left.value}` : null, 
                                node.right ? `${tag}-bracket-set-${node.right.value}`: null
                            ],
                            lowerSetID: node.buddy ? node.buddy.value : -1,
                            nextSetID: node.parent ? node.parent.value : -1
                        })
                    }
                    else {
                        setEditorData({
                            ...editorData,
                            setID: node.value,
                            gameTag: tag,
                            parents: [
                                node.left ? `${tag}-bracket-set-${node.left.value}` : null, 
                                node.right ? `${tag}-bracket-set-${node.right.value}`: null
                            ],
                            lowerSetID: node.buddy ? node.buddy.value : -1,
                            nextSetID: node.parent ? node.parent.value : -1
                        })
                    }
                }
                catch(e) {
                    console.log('Failed to fetch data: ', e)
                }
            }

            retrieveSetData()
        }

        return (
            <React.Fragment>
                <BracketSetEditor 
                    editorData={editorData} 
                    setEditorData={setEditorData} 
                    toggleEditor={toggleEditor}
                    setToggleEditor={setToggleEditor}
                    allSets={allNodes}/>
                <div><BuildBracket nodeArr={upperBracketArray}/></div>
                <div><BuildBracket nodeArr={lowerBracketArray}/></div>
            </React.Fragment>
        )
    }
    
    return (
        <div /*onLoadStart={useXarrow()}*/ className="bracket-container"><BracketMap tag={gameTag}/></div>
    )
}