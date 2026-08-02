// export function GroupSet({ set }) {
//     return (
//         <tr className="group-row">
//             <td>{set.winnerStats.names.join('/')}</td>
//             <td>{set.winnerStats.matchesWon} - {set.loserStats.matchesWon}</td>
//             <td>{set.loserStats.names.join('/')}</td>
//         </tr>
//     )
// };

// export const GroupTable = ({ groupName, listFunc } { groupName : string, listFunc : }) => {
//     return (
//         <div>
//             <span>{groupName}</span>
//             <table className="group-table">
//                 <tbody>{listFunc}</tbody>
//             </table>
//         </div>
//     )
// }

// export const BracketSet = ({ set }) => {
//     const organize = (wStats, lStats) => {

//         const valueW = wStats.prevSet ? wStats.prevSet.setNumber : -1;
//         const valueL = lStats.prevSet ? lStats.prevSet.setNumber : -1;

//         let stats = []
//         if (valueL < valueW) {
//             stats = [lStats, wStats]
//         }
//         else {
//             stats = [wStats, lStats]
//         }

//         return stats.map((stat) => {
//             return (
//                 <div key={stat._id} className={`${stat.winner ? '' : 'matchup-loser'}`}>
//                     <div className="matchup-player-block"><span>{stat.names.join('/')}</span></div>
//                     <div className="matchup-score-block"><span>{stat.matchesWon}</span></div>
//                 </div>
//             )
//         })
//     }
//     return (
//         <div className="matchup-block">
//             {organize(set.winnerStats, set.loserStats)}
//         </div>
//     )
// }
