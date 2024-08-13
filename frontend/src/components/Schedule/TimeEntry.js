import React, { useState, useEffect } from "react";
import { TimeInterval } from "./TimeInterval";


export const TimeEntry = ({ timeInvervalData, setTimeIntervalData }) => {

    const [oldData, setOldData] = useState(Array(48).fill(false))

    const [lockedClick, setLockedClick] = useState(false)

    const [startInterval, setStartInterval] = useState(0)

    const [mode, setMode] = useState(true)

    useEffect(() => {

        if (lockedClick) {
            setOldData(timeInvervalData)
        }
        
    },[lockedClick])

    const toggleRange = (index) => {

        let newIntervalArr = [...timeInvervalData]

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

    const updateRange = (index) => {
        if (lockedClick) {

            let left = startInterval <= index ? startInterval : index
            let right = left === startInterval ? index : startInterval

            setTimeIntervalData(timeInvervalData.map((interval, i) => {
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
                timeInvervalData.map((interval, index) => {
                    return (
                        <TimeInterval 
                            index={index} 
                            intervalData={interval}
                            toggleRange={setTimeIntervalData ? toggleRange : null}
                            updateRange={setTimeIntervalData ? updateRange : null}
                            key={index}/>
                    )
                })
            }
        </div>
    )
}