import React, { useEffect, useState, useRef } from "react"

import { Profile } from "./Profile"
import GetUrl from "../GetUrl"

export const EditorPopUp = ({editorData, setEditorData, profiles, toggleEditor, setToggleEditor}) => {

    const [seedSelect, setSeedSelect] = useState('upper')
    const scrollRef = useRef(null);

    const resetEditor = () => {
        setEditorData({
            setID: 0,
            gameTag: "",
            upperSeed: null,
            upperSeedWins: '',
            lowerSeed: null,
            lowerSeedWins: '',
            bestOf: '',
            parents: []
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

        updateSetData()
        resetEditor()
    }

    function profileList() {
        return profiles.map((profile) => {
            return (
                <Profile
                    profile={profile}
                    wt={40}
                    ht={50}
                    setEditorState={setEditorData}
                    editorState={editorData}
                    editorField={seedSelect}
                    key={profile._id}
                />
            );
        });
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
                <div className="profile-list-container-small">
                    <button onClick={() => shift(-200)}>{'<'}</button>
                    <ul ref={scrollRef} className="profile-list">{profileList()}</ul>
                    <button onClick={() => shift(200)}>{'>'}</button>
                </div>
                <form onSubmit={(e) => onSubmit(e)}>
                    <label>{`SetID : ${editorData.setID}`}</label>
                    <label onClick={() => {setSeedSelect('upper')}} style={seedSelect == 'upper' ? {border: '1px solid black'} : null}>
                        {`Upper Seed : ${editorData.upperSeed ? editorData.upperSeed.name : 'None'}`}
                    </label>
                    <input
                        value={editorData.upperSeedWins || 0}
                        onChange={e => setEditorData({...editorData, upperSeedWins: e.target.value})}
                        type="number"
                    />
                    <label onClick={() => {setSeedSelect('lower')}} style={seedSelect == 'lower' ? {border: '1px solid black'} : null}>
                        {`Lower Seed : ${editorData.lowerSeed ? editorData.lowerSeed.name : 'None'}`}
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