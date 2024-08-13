import React, { useEffect, useState } from "react"

export const BracketSet = ({setData}) => {

    const [localData, setLocalData] = useState({
        setID: 0,
        gameTag: "",
        upperSeedIDs: [],
        upperSeedProfiles: [],
        upperSeedWins: '',
        lowerSeedIDs: [],
        lowerSeedProfiles: [],
        lowerSeedWins: '',
        bestOf: 0,
        parents: [],    //Rename this, preceeding sets
        lowerSetID: -1,
        nextSetID: -1
    })

    useEffect(() => {

        if (setData) {
            setLocalData({...setData})
        }
        
    }, [setData])
    

    return (
        <React.Fragment>
            <div className="bracket-set-box open-bracket-slot">
                <div style={localData.lowerSeedWins > Math.floor(localData.bestOf / 2) ? {backgroundColor: "gray"} : null}>
                    <p style={{fontSize: '0.75vw'}}>{localData.upperSeedProfiles.map(x => x.name).join('/')}</p><p>{localData.upperSeedWins}</p>
                </div>
                <div style={localData.upperSeedWins > Math.floor(localData.bestOf / 2) ? {backgroundColor: "gray"} : null}>
                    <p style={{fontSize: '0.75vw'}}>{localData.lowerSeedProfiles.map(x => x.name).join('/')}</p><p>{localData.lowerSeedWins}</p>
                </div>
            </div>
        </React.Fragment>
    )
}