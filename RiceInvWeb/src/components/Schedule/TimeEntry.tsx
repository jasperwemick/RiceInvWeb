import React, { useState, useEffect } from "react";
import TimeInterval from "./TimeInterval";


interface TimeEntryProps {
    timeIntervalData : boolean[];
    setTimeIntervalData : React.Dispatch<React.SetStateAction<boolean[]>>;
}

export default function TimeEntry({ timeIntervalData, setTimeIntervalData } : TimeEntryProps) {

    const [oldData, setOldData] = useState<boolean[]>(Array(48).fill(false))

    const [lockedClick, setLockedClick] = useState(false)

    const [startInterval, setStartInterval] = useState(0)

    const [mode, setMode] = useState(true)

    useEffect(() => {

        if (lockedClick) {
            setOldData(timeIntervalData)
        }
        
    },[lockedClick])

    const toggleRange = (index : number) => {

        let newIntervalArr = [...timeIntervalData]

        if (!lockedClick) {
            if (newIntervalArr[index]) {
                setMode(false)
                newIntervalArr[index] = false
            }
            else {
                setMode(true)
                newIntervalArr[index] = true
            }
        }
        else {
            // Memorize previous saved state of array
            setOldData(newIntervalArr)
        }

        setLockedClick(!lockedClick)
        setStartInterval(index)
        setTimeIntervalData(newIntervalArr)
    }

    const updateRange = (index : number) => {
        if (lockedClick) {

            let left = startInterval <= index ? startInterval : index
            let right = left === startInterval ? index : startInterval

            setTimeIntervalData(timeIntervalData.map((interval : boolean, i : number) => {
                if (i >= left && i <= right) {
                    return mode
                }
                return oldData[i]
            }))

        }
    }

    return (
        <div className={`time-entry-container`} >
            {
                timeIntervalData.map((interval, index) => {
                    return (
                        <TimeInterval 
                            index={index} 
                            intervalData={interval}
                            toggleRange={toggleRange}
                            updateRange={updateRange}
                            key={index}/>
                    )
                })
            }
        </div>
    )
}