import React, { useEffect, useState } from "react"
import { SetSchema } from "../../data/types"

export default function BracketSet({ setData } : { setData : SetSchema }) {

    const [localData, setLocalData] = useState<SetSchema>({
        setID: 0,
        gameTag: "",
        upperSeedIds: [],
        upperSeedProfiles: [],
        upperSeedWins: 0,
        lowerSeedIds: [],
        lowerSeedProfiles: [],
        lowerSeedWins: 0,
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
        <div className="bracket-set-box open-bracket-slot">
            <div style={localData.lowerSeedWins > Math.floor(localData.bestOf / 2) ? {backgroundColor: "gray"} : undefined}>
                <p style={{fontSize: '0.75vw'}}>{localData.upperSeedProfiles.map(x => x.name).join('/')}</p><p>{localData.upperSeedWins}</p>
            </div>
            <div style={localData.upperSeedWins > Math.floor(localData.bestOf / 2) ? {backgroundColor: "gray"} : undefined}>
                <p style={{fontSize: '0.75vw'}}>{localData.lowerSeedProfiles.map(x => x.name).join('/')}</p><p>{localData.lowerSeedWins}</p>
            </div>
        </div>
    );
}