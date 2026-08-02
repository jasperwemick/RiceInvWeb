interface PlacementData {
    mappedName : string[];
    placing : number;
    scores : number;
}

interface PlacementProps {
    placement : PlacementData
}

export default function Placement({ placement } : PlacementProps) {

    return (
        <tr>
            <td><span>{placement.placing}</span></td>
            <td><span>{placement.mappedName.join(' / ')}</span></td>
            {/* <td><span>{scores[placement.scores][placement.placing]}</span></td> */}
        </tr>
    )
}