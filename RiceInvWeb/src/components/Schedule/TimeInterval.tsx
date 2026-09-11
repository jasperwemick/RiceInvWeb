import type { TimeIntervalData } from "../../data/types";

interface TimeIntervalProps {
    index : number;
    intervalData : boolean | TimeIntervalData;
    toggleRange? : ((index : number) => void) | null;
    updateRange? : ((index : number) => void) | null;
    laterHalf? : boolean;
}

export default function TimeInterval({index, intervalData, toggleRange, updateRange, laterHalf = false} : TimeIntervalProps) {

    const indexToTime = (index : number, laterHalf : boolean) => {
        let hour = String(Math.floor(index / 2) % 12)
        hour = hour.length === 1 ? '0' + hour : '' + hour 
        hour = hour === '00' ? '12' : hour
        const minutes = index % 2 == 0 ? '00' : '30'
        const mmm = laterHalf ? 'PM' : Math.floor(index / 2) < 12 ? 'AM' : 'PM'
        return hour + ':' + minutes + ' ' + mmm
    }

    if (typeof intervalData === 'boolean') {
        return (
            <div>
                <p className="no-select-text" style={{fontSize: 9, marginTop: -4}}>{indexToTime(index, laterHalf)}</p>
                <div
                    className={`time-interval-block ${intervalData ? `time-interval-selected` : null}`} 
                    onMouseEnter={updateRange ? () => updateRange(index) : () => {}}
                    onClick={toggleRange ? () => toggleRange(index) : () => {}}>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <p className="no-select-text" style={{fontSize: 9, marginTop: -4}}>{indexToTime(index, laterHalf)}</p>
                <div
                    className={`time-interval-block ${intervalData.strength > 0 ? `time-interval-selected` : null}`} 
                    style={intervalData.strength > 0 ? {opacity: intervalData.strength} : undefined}
                    onMouseEnter={toggleRange ? () => toggleRange(index) : () => {}}
                    onMouseLeave={toggleRange ? () => toggleRange(-1) : () => {}}>
                </div>
            </div>
        )
    }


}