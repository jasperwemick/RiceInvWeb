const onesScores = {

}

const twosScores = {

}

const scores = {
    1: {
        1: 120,
        2: 100,
        3: 80,
        4: 60,
        5: 50,
        7: 40,
        9: 25,
        13: 15,
        99: 10
    },
    2: {
        1: 80,
        2: 60,
        3: 45,
        4: 36,
        5: 28,
        7: 20,
        99: 15
    },
    3: {
        1: 140,
        2: 125,
        3: 110,
        4: 100,
        5: 90,
        6: 85,
        7: 80,
        8: 75,
        9: 70,
        10: 70,
        11: 70,
        12: 70,
        13: 70,
        14: 70,
        99: 25
    }
}

export const Placement = (props) => {

    return (
        <tr>
            <td><span>{props.placement.placing}</span></td>
            <td><span>{props.placement.mappedName.join(' / ')}</span></td>
            <td><span>{scores[props.placement.scores][props.placement.placing]}</span></td>
        </tr>
    )
}

export default Placement;