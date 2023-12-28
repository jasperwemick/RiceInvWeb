import React, { useState } from "react";


export const GroupSet = (props) => {
    const [group, setGroup] = useState(false)

    const toggle = () => {
    }

    return (
        <tr className="group-row">
            <td>{props.set.winnerName}</td>
            <td>{props.set.winnerStats.matchesWon} - {props.set.loserStats.matchesWon}</td>
            <td>{props.set.loserName}</td>
        </tr>
    )
};

export const GroupTable = (props) => {
    return (
        <div>
            <span>{props.groupName}</span>
            <table className="group-table">
                <tbody>{props.listFunc}</tbody>
            </table>
        </div>
    )
}

export const GauntletSet = (props) => {
    return (
        <div className="matchup-block">
            <div>
                <div className="matchup-player-block"><span>{props.set.winnerName}</span></div>
                <div className="matchup-score-block"><span>{props.set.winnerStats.matchesWon}</span></div>
            </div>
            <div className="matchup-loser">
                <div className="matchup-player-block"><span>{props.set.loserName}</span></div>
                <div className="matchup-score-block"><span>{props.set.loserStats.matchesWon}</span></div>
            </div>
        </div>
    )
}

export const GauntletBracket = (props) => {
    return (
        <li>
            <div className="gauntlet-bracket">{props.listFunc}</div>
        </li>
    )
}

export const PlayoffSet = (props) => {

    return (
        <div className="matchup-block">
            <div>
                <div className="matchup-player-block"><span>{props.set.winnerName}</span></div>
                <div className="matchup-score-block"><span>{props.set.winnerStats.matchesWon}</span></div>
            </div>
            <div className="matchup-loser">
                <div className="matchup-player-block"><span>{props.set.loserName}</span></div>
                <div className="matchup-score-block"><span>{props.set.loserStats.matchesWon}</span></div>
            </div>
        </div>
    )
}

export const PlayoffColumn = (props) => {
    return (
        <div>
            <div className="playoff-headers" style={{left: props.left}}>{props.header}</div>
            <div className={props.column} style={{left: props.left}}>{props.listFunc}</div>
        </div>
    )
}
