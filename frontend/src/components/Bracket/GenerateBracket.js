import React, { useEffect, useState, useRef } from "react"
import Xarrow, { useXarrow } from 'react-xarrows'

import './style/Bracket.css'
import '../../style/home.css'
import { BracketSet } from "./BracketSet"
import GetUrl from "../../GetUrl"
import { GenerateBracketTree, getMaxDepth, treeToArray } from './Auxillery/tree'
import { BracketSetEditor } from "./BracketSetEditor"

export const GenerateBracket = ({type, numPlayers, format, gameTag}) => {

    const [highTree, setHighTree] = useState(null)
    const [lowTree, setLowTree] = useState(null)
    const [maxDepth, setMaxDepth] = useState(0)
    
    useEffect(() => {

        let bracketTree = GenerateBracketTree(type, numPlayers, format)
        setMaxDepth(getMaxDepth(bracketTree))
        
        let lowerBracketTree = null
        let upperBracketTree = null

        if (type === 'Single') {
            upperBracketTree = bracketTree
        }
        else {
            lowerBracketTree = bracketTree.right
            bracketTree.right = null
            upperBracketTree = bracketTree
        }

        setHighTree(upperBracketTree)
        setLowTree(lowerBracketTree)

    }, [type, numPlayers, format])

    const BracketMap = ({tag}) => {

        const [profiles, setProfiles] = useState([]);

        const upperBracketArray = treeToArray(highTree, maxDepth)
        const lowerBracketArray = treeToArray(lowTree, maxDepth)

        const [toggleEditor , setToggleEditor] = useState(false)

        const [editorData, setEditorData] = useState({
            setID: 0,
            gameTag: "",
            upperSeed: null,
            upperSeedWins: '',
            lowerSeed: null,
            lowerSeedWins: '',
            bestOf: '',
            parents: []
        })

        const [sets, setSets] = useState([])

        useEffect(() => {

            const getSetData = async () => {

                try {
                    const setData = await fetch(`${GetUrl}/api/games/set/${tag}`)
                    const jsetData = await setData.json()

                    setSets(jsetData)
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
                                    <div className="bracket-set-shell" id={`${tag}-bracket-set-${node.value}`} onClick={() => handleSlotClick(node, tag)}>
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

            const retrieveSetData = async () => {

                try {
                    console.log(sets)
                    const jsponse = sets.find(({ setID }) => setID === node.value)

                    if (profiles.length === 0) {
                        const resTwo = await fetch(`${GetUrl}/api/profiles/default/noimg`)
                        const twosponse = await resTwo.json()
                        console.log(twosponse)

                        setProfiles(twosponse)
                    }

                    if (jsponse) {
                        setEditorData({
                            ...editorData,
                            setID: node.value,
                            gameTag: tag,
                            upperSeed: jsponse.upperSeed,
                            upperSeedWins: jsponse.upperSeedWins,
                            lowerSeed: jsponse.lowerSeed,
                            lowerSeedWins: jsponse.lowerSeedWins,
                            bestOf: jsponse.bestOf,
                            parents: [
                                node.left ? `${tag}-bracket-set-${node.left.value}` : null, 
                                node.right ? `${tag}-bracket-set-${node.right.value}`: null
                            ]
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
                            ]
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
                    profiles={profiles}
                    toggleEditor={toggleEditor}
                    setToggleEditor={setToggleEditor}/>
                <div><BuildBracket nodeArr={upperBracketArray}/></div>
                <div><BuildBracket nodeArr={lowerBracketArray}/></div>
            </React.Fragment>
        )
    }
    
    return (
        <div onLoad={useXarrow()} className="bracket-container"><BracketMap tag={gameTag}/></div>
    )
}