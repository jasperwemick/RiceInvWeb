import React, { useEffect, useState, useRef } from "react"
import GetUrl from "../../GetUrl"
import { ProfileList } from "../Profile/ProfileList"
import { SelectableProfile } from "../Profile/SelectableProfile"

export const BracketSetEditor = ({editorData, setEditorData, toggleEditor, setToggleEditor, allSets}) => {

    const [seedSelect, setSeedSelect] = useState('upper')
    const scrollRef = useRef(null);

    const seedRef = useRef(null)

    const setEditorSeeds = (arr) => {
        // replace using ref

        if (seedSelect === 'upper') {
            setEditorData({...editorData, upperSeedIDs: arr})
        }
        else {
            setEditorData({...editorData, lowerSeedIDs: arr})
        }
        
    }

    const resetEditor = () => {
        setEditorData({
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
    }

    const onSubmit = (e) => {

        e.preventDefault()

        setToggleEditor(false)

        const updateSetData = async () => {

            try {
                await fetch(`${GetUrl}/api/games/set/${editorData.gameTag}/${editorData.setID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editorData)
                })
            }
            catch(e) {
                console.log('Failed to fetch at PUT /api/games/set/:tag/:num: ', e)
            }

        }

        const progressBracket = (seed) => {

            let nextSetData = null
            const nextSetNode = allSets.find(({ value }) => value === editorData.nextSetID)

            if (nextSetNode) {

                const winners = seed === 'U' ? editorData.upperSeedIDs : editorData.lowerSeedIDs
                const nextHasTwoParents = nextSetNode.left != null && nextSetNode.right != null

                console.log(nextHasTwoParents)
                console.log(nextSetNode.right)
    
                nextSetData = {
                    setID: editorData.nextSetID,
                    gameTag: editorData.gameTag,
                    upperSeedIDs: ((nextSetNode.left ? nextSetNode.left.value === editorData.setID : null) && nextHasTwoParents) ? winners : [],
                    upperSeedWins: 0,
                    lowerSeedIDs: ((nextSetNode.right ? nextSetNode.right.value === editorData.setID : null) || !nextHasTwoParents) ? winners : [],
                    lowerSeedWins: 0,
                    bestOf: editorData.bestOf,
                    parents: [
                        nextSetNode.left ? nextSetNode.left.value : null, 
                        nextSetNode.right ? nextSetNode.right.value : null
                    ],
                    lowerSetID: nextSetNode.buddy ? nextSetNode.buddy.value : -1,
                    nextSetID: nextSetNode.parent ? nextSetNode.parent.value : -1
                }
            }

            let lowerSetData = null
            const lowerSetNode = allSets.find(({ value }) => value === editorData.lowerSetID)
            
            if (lowerSetNode) {

                const losers = seed === 'U' ? editorData.lowerSeedIDs : editorData.upperSeedIDs
                const lowerHasNoParents = lowerSetNode.left == null && lowerSetNode.right == null
   
                const getlinkedUpperSets = () => {
                    const ret = allSets.filter((x) => x.buddy ? x.buddy.value === editorData.lowerSetID : false).sort((a, b) => a.value - b.value)
                    console.log(ret)
                    return ret
                }

                lowerSetData = {
                    setID: editorData.lowerSetID,
                    gameTag: editorData.gameTag,
                    upperSeedIDs: lowerHasNoParents ? (editorData.setID === getlinkedUpperSets()[0].value ? losers : []) : losers,
                    upperSeedWins: 0,
                    lowerSeedIDs: lowerHasNoParents ? (editorData.setID === getlinkedUpperSets()[1].value ? losers : []) : [],
                    lowerSeedWins: 0,
                    bestOf: editorData.bestOf,
                    parents: [
                        lowerSetNode.left ? lowerSetNode.left.value : null, 
                        lowerSetNode.right ? lowerSetNode.right.value : null
                    ],
                    lowerSetID: -1,
                    nextSetID: lowerSetNode.parent ? lowerSetNode.parent.value : -1
                }
            }

            const submitExtensionSets = async () => {
                try {
                    await fetch(`${GetUrl}/api/games/set/${editorData.gameTag}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify([nextSetData, lowerSetData])
                    })
                }
                catch(e) {
                    console.log('Failed to fetch at PUT /api/games/set/:tag: ', e)
                }
            }

            if (nextSetData && lowerSetData) {
                if (nextSetData.setID === lowerSetData.setID) {
                    nextSetData.upperSeedIDs = nextSetData.upperSeedIDs.concat(lowerSetData.upperSeedIDs)
                    nextSetData.lowerSeedIDs = nextSetData.lowerSeedIDs.concat(lowerSetData.lowerSeedIDs)
                    lowerSetData = null
                }
            }


            submitExtensionSets()

        }

        updateSetData()
        if (editorData.upperSeedWins > editorData.bestOf / 2) {
            progressBracket('U')
        }
        else if (editorData.lowerSeedWins > editorData.bestOf / 2) {
            progressBracket('L')
        }
        resetEditor()
    }

    const shift = (offset) => {
        scrollRef.current.scrollLeft += offset;
    }

    const onDelete = () => {

        setToggleEditor(false)

        const deleteSetData = async () => {

            try {
                await fetch(`${GetUrl}/api/games/set/${editorData.gameTag}/${editorData.setID}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
            }
            catch(e) {
                console.log('Failed to fetch at PUT /api/games/set/:tag/:num: ', e)
            }

        }

        deleteSetData()
        resetEditor()
    }

    return (
        <div style={{zIndex:20}}>
            <div 
                className="bracket-insertion-pop" 
                style={toggleEditor ? null : {visibility: 'hidden', pointerEvents: 'none'}}>
                    <ProfileList 
                    shiftOffset={200}
                    Wrapper={SelectableProfile} 
                    WrapperProps={{
                        selectedList: (seedSelect === 'upper' ? editorData.upperSeedIDs : editorData.lowerSeedIDs), 
                        setSelectedList: setEditorSeeds, 
                        refreshTrigger: [editorData.setID, seedSelect]
                    }}/>
                    <form onSubmit={(e) => onSubmit(e)}>
                    <label>{`SetID : ${editorData.setID}`}</label>
                    <label onClick={() => {setSeedSelect('upper')}} style={seedSelect == 'upper' ? {border: '1px solid black'} : null}>
                        {`Upper Seed : ${editorData.upperSeedIDs}`}
                    </label>
                    <input
                        value={editorData.upperSeedWins || 0}
                        onChange={e => setEditorData({...editorData, upperSeedWins: e.target.value})}
                        type="number"
                    />
                    <label onClick={() => {setSeedSelect('lower')}} style={seedSelect == 'lower' ? {border: '1px solid black'} : null}>
                        {`Lower Seed : ${editorData.lowerSeedIDs}`}
                    </label>
                    <input
                        value={editorData.lowerSeedWins || 0}
                        onChange={e => setEditorData({...editorData, lowerSeedWins: e.target.value})}
                        type="number"
                    />
                    <input
                        value={editorData.bestOf || 0}
                        onChange={e => setEditorData({...editorData, bestOf: e.target.value})}
                        type="number"
                    />
                    <input
                        value="Update Set"
                        type="submit"
                    />
                </form>
                <div style={{display: "flex", width: '80%', justifyContent: 'space-between'}}>
                <button style={{width: 60, height: 60}} onClick={() => {
                    setToggleEditor(false)
                    resetEditor()
                }}/>
                <button style={{width: 60, height: 60, backgroundColor: 'red'}} onClick={() => onDelete()}/>
                </div>
            </div>
        </div>
    )
}