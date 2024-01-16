import React from "react";


export const GroupSet = (props) => {
    // const [group, setGroup] = useState(false)

    // const toggle = () => {
    // }

    return (
        <tr className="group-row">
            <td>{props.set.winnerStats.names.join('/')}</td>
            <td>{props.set.winnerStats.matchesWon} - {props.set.loserStats.matchesWon}</td>
            <td>{props.set.loserStats.names.join('/')}</td>
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

export const BracketSet = (props) => {

    // clean this later
    const organize = (wStats, lStats) => {

        const valueW = wStats.prevSet ? wStats.prevSet.setNumber : -1;
        const valueL = lStats.prevSet ? lStats.prevSet.setNumber : -1;

        let stats = []
        if (valueL < valueW) {
            stats = [lStats, wStats]
        }
        else {
            stats = [wStats, lStats]
        }

        return stats.map((stat) => {
            return (
                <div key={stat._id} className={`${stat.winner ? '' : 'matchup-loser'}`}>
                    <div className="matchup-player-block"><span>{stat.names.join('/')}</span></div>
                    <div className="matchup-score-block"><span>{stat.matchesWon}</span></div>
                </div>
            )
        })
    }
    return (
        <div className="matchup-block">
            {organize(props.set.winnerStats, props.set.loserStats)}
        </div>
    )
}
