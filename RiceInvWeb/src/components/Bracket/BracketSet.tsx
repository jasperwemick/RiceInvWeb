import { useEffect, useState } from "react"
import type { TournamentSet } from "../../data/types";
import { useXarrow } from "../../util/xarrow-compat";


function MapSetInfo({ teamRecords, setData } : { teamRecords : Record<string, number>, setData : TournamentSet }) {
    return Object.entries(teamRecords).map(([teamName, count]) => ({ teamName, count })).sort((a, b) => b.count - a.count).map((record) => {
        return (
            <div style={record.count > Math.floor(setData.bestOf / 2) ? {backgroundColor: "gray"} : undefined}>
                <p style={{fontSize: '0.75vw'}}>{record.teamName}</p><p>{record.count}</p>
            </div>
        )
    })
}


export default function BracketSet({ setData, ref } : { setData : TournamentSet | undefined, ref : React.RefObject<HTMLDivElement> }) {

    const [localData, setLocalData] = useState<TournamentSet | null>(null);
    const [teamRecords, setTeamRecords] = useState<Record<string, number>>({});

    // useEffect(() => {
    //     if (setData) {
    //         const matches = setData.matches;
    //         const wins = matches.reduce((accum, match) => {
    //             accum[match.winner.name] = (accum[match.winner.name] ?? 0) + 1;
    //             return accum;
    //         }, {} as Record<string, number>)
    //         setTeamRecords(wins);
    //     }
    // }, [setData])
    
    if (setData) {
        return (
            <div className="bracket-set-shell" ref={ref}> 
                <div className={`bracket-set-box open-bracket-slot`}>{setData.participants.toString()}</div>
                {/* <MapSetInfo teamRecords={teamRecords} setData={localData}/> */}
            </div>
        );
    }
    else {
        return (
            <div className="bracket-set-shell" ref={ref}>
                <div className={`bracket-set-box open-bracket-slot`}>asdf</div>
            </div>
        );
    }


}