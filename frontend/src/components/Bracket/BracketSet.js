import React, { useEffect, useState } from "react"

import '../../style/Bracket.css'

export const BracketSet = ({setData}) => {

    const [localData, setLocalData] = useState({
        setID: 0,
        gameTag: "",
        upperSeed: null,
        upperSeedWins: 0,
        lowerSeed: null,
        lowerSeedWins: 0,
        bestOf: 0,
        parents: []
    })

    useEffect(() => {

        setLocalData({...setData})
        
    }, [setData])
    

    return (
        <React.Fragment>
            <div className="bracket-set-box open-bracket-slot">
                <div style={localData.lowerSeedWins > Math.floor(localData.bestOf / 2) ? {backgroundColor: "gray"} : null}>
                    <span style={{fontSize: '0.75vw'}}>{localData.upperSeed ? localData.upperSeed.name : ""}</span><span>{localData.upperSeedWins}</span>
                </div>
                <div style={localData.upperSeedWins > Math.floor(localData.bestOf / 2) ? {backgroundColor: "gray"} : null}>
                    <span style={{fontSize: '0.75vw'}}>{localData.lowerSeed ? localData.lowerSeed.name : ""}</span><span>{localData.lowerSeedWins}</span>
                </div>
            </div>
        </React.Fragment>
    )
}